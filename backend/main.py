from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse # Added import
import uvicorn
import os
import numpy as np
import pandas as pd
import joblib
import json
import torch

# Import preprocessing
from utils.preprocessing import preprocess_eeg
# Import new feature extraction functions
from models.features import (
    time_series_features, 
    freq_band_features, 
    hjorth_features, 
    fractal_features, 
    entropy_features
)
from models.anfis_3level import ANFIS

# Define folders
UPLOAD_FOLDER = "uploads"
import logging

# Configure Logging to File
logging.basicConfig(
    filename='backend_debug.log', 
    level=logging.DEBUG, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    force=True
)

# --- CONFIGURATION ---
MODELS_CONFIG = {
    "freqband": {
        "model": "models/anfis_freqband_model.pth",
        "scaler": "models/scaler_freqband.pkl",
        "selector": "models/selected_features_freqband.pkl",
        "lime_bg": "models/lime_background.npy" 
    },
    "hjorth": {
        "model": "models/anfis_hjorth_model.pth",
        "scaler": "models/scaler_hjorth.pkl",
        "selector": "models/selected_features_hjorth.pkl",
        "lime_bg": "models/lime_background_hjorth.npy"
    }
}

# Global Registry
# Structure: "key": { "model": obj, "scaler": obj, "selector": list, "explainer": obj }
LOADED_MODELS = {}

# Load Resources on Startup
def load_resources():
    global LOADED_MODELS
    
    for key, paths in MODELS_CONFIG.items():
        print(f"\n🔵 Loading Model: {key.upper()}...")
        resources = {}
        
        try:
            # 1. Load Scaler
            if os.path.exists(paths['scaler']):
                resources['scaler'] = joblib.load(paths['scaler'])
                print(f"   ✅ Scaler loaded.")
            else:
                print(f"   ❌ Scaler missing: {paths['scaler']}")
                continue

            # 2. Load Selector
            if os.path.exists(paths['selector']):
                resources['selector'] = joblib.load(paths['selector'])
                print(f"   ✅ Selector loaded.")
            else:
                print(f"   ❌ Selector missing: {paths['selector']}")
                continue

            # 3. Load ANFIS Model
            if os.path.exists(paths['model']):
                state_dict = torch.load(paths['model'])
                if 'mu' in state_dict:
                    n_inputs, n_rules = state_dict['mu'].shape
                    model_instance = ANFIS(n_inputs=n_inputs, n_rules=n_rules)
                    model_instance.load_state_dict(state_dict)
                    model_instance.eval()
                    resources['model'] = model_instance
                    print(f"   ✅ ANFIS Model loaded (In: {n_inputs}, Rules: {n_rules})")
                else:
                    print(f"   ❌ Invalid state_dict in {paths['model']}")
                    continue
            else:
                print(f"   ❌ Model file missing: {paths['model']}")
                continue
            
            # 4. Init LIME (Lazy load or Pre-load?)
            # Let's pre-load only if background data exists
            if os.path.exists(paths['lime_bg']):
                 bg_data = np.load(paths['lime_bg'])
                 import lime.lime_tabular
                 explainer = lime.lime_tabular.LimeTabularExplainer(
                    bg_data,
                    mode='regression',
                    feature_names=resources['selector'],
                    class_names=['Stress Index'],
                    verbose=False,
                    random_state=42
                 )
                 resources['explainer'] = explainer
                 print(f"   ✅ LIME Explainer ready.")
            else:
                 print(f"   ⚠️ LIME Background missing. Explainer will result in error if used.")
            
            # Save to Registry
            LOADED_MODELS[key] = resources
            print(f"🟢 {key.upper()} Pipeline Ready.")

        except Exception as e:
            print(f"   ❌ Failed to load {key}: {e}")

load_resources()


def predict_anfis_wrapper(data_numpy, model_key="freqband"):
    """
    Wrapper for LIME.
    Input: numpy array (n_samples, n_features)
    """
    if model_key not in LOADED_MODELS:
        return np.zeros(data_numpy.shape[0])
    
    pkg = LOADED_MODELS[model_key]
    model = pkg['model']
    scaler = pkg['scaler']

    if data_numpy.ndim == 1:
        data_numpy = data_numpy.reshape(1, -1)
        
    scaled_data = scaler.transform(data_numpy)
    tensor_data = torch.tensor(scaled_data, dtype=torch.float32)
    with torch.no_grad():
        preds = model(tensor_data)
        
    return preds.numpy().flatten()

def generate_explanation(instance_features, model_key="freqband"):
    """
    Generates LIME explanation for a single instance.
    """
    if model_key not in LOADED_MODELS:
        return []
        
    explainer = LOADED_MODELS[model_key].get('explainer')
    if not explainer:
        return []
        
    try:
        # instance_features should be (1, n_selected) - The Peak Vector
        # Ensure it's 1D for explain_instance
        instance_to_explain = instance_features.flatten()
        
        # Define wrapper that fixes the model_key
        def wrapper(data):
            return predict_anfis_wrapper(data, model_key=model_key)
        
        exp = explainer.explain_instance(
            instance_to_explain, 
            wrapper,
            num_features=10
        )
        
        # Return original list of tuples for frontend compatibility [[name, weight], ...]
        return exp.as_list()
        
    except Exception as e:
        print(f"Explanation failed: {e}")
        return []

app = FastAPI()

# CORS Middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    channels: str = Form(None),
    model: str = Form("freqband") # New Parameter
):
    """
    API endpoint for EEG stress prediction
    """
    print(f"🚀 New Analysis Request: {file.filename} using Model: {model.upper()}")
    
    # Save uploaded file
    filename_lower = file.filename.lower()
    if not (filename_lower.endswith('.csv') or filename_lower.endswith('.mat')):
         return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid file type. Please upload a .csv or .mat file."})

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        return JSONResponse(status_code=400, content={"status": "error", "message": "File upload failed. The file may be corrupted."})

    try:
        # Parse channels
        selected_channels = json.loads(channels) if channels else None

        # Determine file type
        filename_lower = file.filename.lower()
        
        if filename_lower.endswith('.mat'):
            # Force USE ALL CHANNELS for .mat files (ignore frontend dropdown)
            # selected_channels = None
            
            import scipy.io
            mat = scipy.io.loadmat(filepath)
            
            # Find data key
            data_keys = ['cleaned_data', 'Clean_data', 'Data', 'data']
            raw_array = None
            for key in data_keys:
                if key in mat:
                    raw_array = mat[key]
                    break
            
            if raw_array is None:
                # Fallback: find any key that is an array
                for k, v in mat.items():
                    if isinstance(v, np.ndarray) and v.shape[0] > 10: # Heuristic
                        raw_array = v
                        break
                        
            if raw_array is None:
                return {"status": "error", "message": "Could not find EEG data key in .mat file"}

            # Ensure Shape (n_channels, n_samples)
            # Typically logic expects (32, Time)
            if raw_array.shape[0] != 32:
                if raw_array.shape[1] == 32:
                    raw_array = raw_array.T
                else:
                    return {"status": "error", "message": f"Expected 32 channels, found {raw_array.shape[0]}"}

            # --- DIRECT NUMPY PATH (Robust) ---
            # Avoid DataFrame conversion risk. We have the data in (Channels, Samples).
            # preprocess_eeg does 3 things: drops columns, selects channels, filters.
            # .mat files don't have bad columns. We just need to filter.
            
            print(f"Applying Training Pipeline Filter (1-50Hz) to {file.filename}...")
            # Ensure shape is (Channels, Samples)
            if raw_array.shape[0] != 32 and raw_array.shape[1] == 32:
                 raw_array = raw_array.T
                 
            # Filter
            from utils.preprocessing import bandpass_filter
            fs = 128
            # Force 1-50Hz filtering (Strict Protocol)
            raw_data = bandpass_filter(raw_array, lowcut=1.0, highcut=50.0, fs=fs, axis=1)
            
            # --- CRITICAL FIX: Z-SCORE NORMALIZATION ---
            # Model expects normalized signal (mean=0, std=1)
            # raw_data shape: (n_channels, n_samples)
            # Normalize Per Channel
            mean = np.mean(raw_data, axis=1, keepdims=True)
            std = np.std(raw_data, axis=1, keepdims=True)
            std[std == 0] = 1.0
            raw_data = (raw_data - mean) / std
            
            # STANDARD CHANNEL MAP (DEAP 32)
            standard_channels = [
                "Cz", "Fz", "Fp1", "F7", "F3", "FC1", "C3", "FC5", 
                "FT9", "T7", "CP5", "CP1", "P3", "P7", "PO9", "O1", 
                "Pz", "Oz", "O2", "PO10", "P8", "P4", "CP2", "CP6", 
                "T8", "FT10", "FC6", "C4", "FC2", "F4", "F8", "Fp2"
            ]
            
            # Channel Selection (if needed)
            if selected_channels:
                indices = [standard_channels.index(c) for c in selected_channels if c in standard_channels]
                if indices:
                    raw_data = raw_data[indices, :]
                    # Update standard_channels to match the subset for correct topomap mapping later
                    standard_channels = [standard_channels[i] for i in indices]
                else:
                    print("⚠️ Channels not matching standard map. Using all 32.")
                    
        else:
            # Load CSV into DataFrame (Legacy/Fallback)
            df = pd.read_csv(filepath)
            
            # --- VALIDATE COLUMNS ---
            # If channels are selected (or default), ensure they exist in the CSV
            required_channels = selected_channels if selected_channels else ["F3", "FC5", "F8", "Fp1", "F4", "P7", "Fp2", "F7"]
            missing_cols = [c for c in required_channels if c not in df.columns]
            
            if missing_cols:
                 return JSONResponse(status_code=400, content={
                     "status": "error", 
                     "message": f"CSV Columns Mismatch. Missing channels: {', '.join(missing_cols)}. Please check your file."
                 })
            
            print(f"Applying Training Pipeline Filter (1-50Hz) to {file.filename}...")
            # Returns: (n_channels, n_samples)
            fs = 128
            # FIX: Enable normalize=True
            raw_data = preprocess_eeg(df, channels=selected_channels, filter=True, normalize=True)

        
        n_channels, n_samples = raw_data.shape
        n_secs = n_samples // fs
        
        if n_secs == 0:
             return {"status": "error", "message": "File too short (< 1 second)"}

        # Truncate to full seconds: (n_channels, n_secs*fs)
        raw_data = raw_data[:, :n_secs*fs]
        
        # Reshape for features.py: (1, n_secs, n_channels, fs)
        # 1. Reshape to (n_channels, n_secs, fs)
        reshaped_data = raw_data.reshape(n_channels, n_secs, fs)
        # 2. Transpose to (n_secs, n_channels, fs)
        reshaped_data = reshaped_data.transpose(1, 0, 2)
        # 3. Add trial dimension
        fin_data = reshaped_data[np.newaxis, ...] # (1, n_secs, n_channels, fs)
        
        # 2. Extract Features
        # Updated to match training script: [0.5, 4, 8, 12, 30, 60]
        feat_time = time_series_features(fin_data)
        feat_freq = freq_band_features(fin_data, freq_bands=[0.5, 4, 8, 12, 30, 60])
        feat_hjorth = hjorth_features(fin_data)
        feat_fractal = fractal_features(fin_data)
        feat_entropy = entropy_features(fin_data)
        
        
        all_feats = np.hstack([feat_time, feat_freq, feat_hjorth, feat_fractal, feat_entropy])
        
        # 3. Select Features
             # Logic to map 'ChX_Feature' strings to indices
             # We need to map Physical Channel Names (e.g. Fz) to Model Channel Names (e.g. Ch5)
             
             # Standard 32-Channel Map (1-based Index -> Name) based on User's Provided List
             # 1:Cz, 2:Fz, 3:Fp1, 4:F7, 5:F3...
        STANDARD_MAP = [
            "Cz", "Fz", "Fp1", "F7", "F3", "FC1", "C3", "FC5", 
            "FT9", "T7", "CP5", "CP1", "P3", "P7", "PO9", "O1", 
            "Pz", "Oz", "O2", "PO10", "P8", "P4", "CP2", "CP6", 
            "T8", "FT10", "FC6", "C4", "FC2", "F4", "F8", "Fp2"
        ]
             
             # Create Reverse Map: Name -> ChX
        NAME_TO_ID = {name: f"Ch{i+1}" for i, name in enumerate(STANDARD_MAP)}
             
        feature_names = []
             
             # Iterate through selected_channels (the ones we actually processed)
             # If selected_channels is None (full file), assume file matches STANDARD_MAP order or provide fallback
             
        current_channels = []
        if selected_channels:
            current_channels = selected_channels
        else:
            # If no channels specified, assume they are the standard 32 in order
            if n_channels == 32:
                 current_channels = STANDARD_MAP
            else:
                 # Fallback: just name them Ch1..ChN (Risk of mismatch!)
                 current_channels = [f"Ch{i+1}" for i in range(n_channels)]

        logging.info(f"DEBUG: Generating features for channels: {current_channels}")

        # 1. Time Series (3)
        for feat in ['Variance', 'RMS', 'PTP']:
            for ch_name in current_channels:
                if ch_name in NAME_TO_ID: model_ch_name = NAME_TO_ID[ch_name]
                else: model_ch_name = ch_name
                feature_names.append(f"{model_ch_name}_{feat}")
                
        # 2. Freq Bands (5)
        for ch_name in current_channels:
            if ch_name in NAME_TO_ID: model_ch_name = NAME_TO_ID[ch_name]
            else: model_ch_name = ch_name
            for feat in ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']:
                    feature_names.append(f"{model_ch_name}_{feat}")
                
        # 3. Hjorth (2)
        for feat in ['Mobility', 'Complexity']:
            for ch_name in current_channels:
                if ch_name in NAME_TO_ID: model_ch_name = NAME_TO_ID[ch_name]
                else: model_ch_name = ch_name
                feature_names.append(f"{model_ch_name}_{feat}")
                
        # 4. Fractal (2)
        for feat in ['Higuchi', 'Katz']:
            for ch_name in current_channels:
                if ch_name in NAME_TO_ID: model_ch_name = NAME_TO_ID[ch_name]
                else: model_ch_name = ch_name
                feature_names.append(f"{model_ch_name}_{feat}")
                
        # 5. Entropy (4)
        for feat in ['AppEntropy', 'SampEntropy', 'SpectEntropy', 'SVD']:
            for ch_name in current_channels:
                if ch_name in NAME_TO_ID: model_ch_name = NAME_TO_ID[ch_name]
                else: model_ch_name = ch_name
                feature_names.append(f"{model_ch_name}_{feat}")
        
        # ---- FETCH RESOURCES FOR SELECTED MODEL ----
        if model not in LOADED_MODELS:
            print(f"❌ Requested model '{model}' not found in registry. Falling back to default 'freqband'?")
             # Could fallback or error. Let's error to be safe.
            return {"status": "error", "message": f"Model '{model}' is not available."}
             
        pkg = LOADED_MODELS[model]
        target_features = pkg['selector']
        scaler = pkg['scaler']
        anfis_model = pkg['model']
        
        # Map selector strings to indices
        try:
            if not isinstance(target_features, list):
                target_features = list(target_features)
            
            logging.info(f"DEBUG: Generated Features: {feature_names}")
            logging.info(f"DEBUG: Required Target Features: {target_features}")
            
            selected_indices = []
            for name in target_features:
                if name in feature_names:
                    selected_indices.append(feature_names.index(name))
                else:
                    logging.warning(f"⚠️ Missing Feature: {name}")
            
            selected_feats = all_feats[:, selected_indices]
            
        except Exception as map_err:
            logging.error(f"Error mapping features: {map_err}")
            selected_feats = all_feats 

             
        # 4. Scale
        if scaler:
            scaled_feats = scaler.transform(selected_feats)
        else:
            scaled_feats = selected_feats
            
        # DEBUG VALUES
        logging.info(f"DEBUG: Selected Features Shape: {selected_feats.shape}")
        logging.info(f"DEBUG: Selected Features Sample (First Row): {selected_feats[0, :5]}") # Print first 5
        logging.info(f"DEBUG: Scaled Features Sample (First Row): {scaled_feats[0, :5]}")
        
        # 5. Predict
        ts_tensor = torch.tensor(scaled_feats, dtype=torch.float32)
        # Use continuous score (1.95) instead of rounded class (2.0)
        with torch.no_grad():
            raw_output = anfis_model(ts_tensor).numpy().flatten()
            logging.info(f"DEBUG: Raw Tensor Output Stats - Min: {np.min(raw_output)}, Max: {np.max(raw_output)}, Mean: {np.mean(raw_output)}")
            preds = raw_output

        
        # Use ROBUST PEAK for detection (Safety Critical but Noise Resistant)
        # Strategy: Take the average of the TOP 3 seconds.
        # This ignores single 1-second glitches (e.g. blinks) but catches real stress (>2s).
        if len(preds) >= 3:
            # Sort descending, take top 3, average them
            top_3 = np.sort(preds)[-3:]
            final_pred = np.mean(top_3)
        else:
            final_pred = np.max(preds) 
            
        # CLAMP PREDICTION to [0, 2]
        final_pred = np.clip(final_pred, 0.0, 2.0)
            
        stress_score = float(final_pred)
        
        # Updated to professional thresholds (0.6 / 1.3)
        if stress_score <= 0.65:
            stress_level = "Low"
        elif stress_score <= 1.35:
            stress_level = "Medium"
        else:
            stress_level = "High"

        # 6. Prepare Visualizations
        # A. Signal Snippet (First 2 seconds of first channel)
        # downsample for performance
        viz_signal = []
        if n_channels > 0 and n_samples > 0:
             # Show WHOLE SIGNAL (Downsampled for Performance)
              channel_idx = 0 
              full_signal = raw_data[channel_idx, :] 
              
              # Target ~1000 points max for UI responsiveness
              total_points = full_signal.shape[0]
              step = max(1, total_points // 1000)
              
              downsampled_signal = full_signal[::step]
              # Generate time axis in seconds (Sample Index / 128Hz)
              viz_signal = [{"time": round(i * step / 128.0, 2), "value": float(v)} for i, v in enumerate(downsampled_signal)]

        # B. Frequency Bands (Average across all channels/seconds)
        # feat_freq shape: (1, n_secs, n_channels*5) -> flattened in earlier step? 
        # Actually feat_freq from utils is (n_trials*n_secs, n_channels*5)
        # We need to average over time (axis 0) first -> (n_channels*5)
        mean_freq = np.mean(feat_freq, axis=0)
        
        # Now average across channels
        # Structure: Ch1_D, Ch1_T, Ch1_A, Ch1_B, Ch1_G, Ch2_D...
        n_bands = 5
        band_names = ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']
        band_totals = np.zeros(n_bands)
        
        for ch in range(n_channels):
            start_idx = ch * n_bands
            # Add channel's bands to total
            band_totals += mean_freq[start_idx : start_idx + n_bands]
            
        band_avgs = band_totals / n_channels
        
        viz_freq = [
            {"name": band_names[i], "value": float(band_avgs[i])} 
            for i in range(n_bands)
        ]

        # Find Index of Peak Stress
        peak_idx = np.argmax(preds)
        peak_features_vector = selected_feats[peak_idx] # Shape (n_features,)
        
        # 7. Generate Explanations & Heatmap
        explanation = generate_explanation(peak_features_vector.reshape(1, -1), model_key=model)
        
        # --- FIX: MAP "ChX" BACK TO "Name" FOR FRONTEND & HEATMAP ---
        ID_TO_NAME = {v: k for k, v in NAME_TO_ID.items()}
        cleaned_explanation = []
        if explanation:
            for feat_name, weight in explanation:
                # Handle "ChX_Band" or "ChX_Feature"
                parts = feat_name.split('_')
                if len(parts) > 0 and parts[0] in ID_TO_NAME:
                    real_name = ID_TO_NAME[parts[0]]
                    new_name = f"{real_name}_{'_'.join(parts[1:])}"
                    cleaned_explanation.append([new_name, weight])
                else:
                    cleaned_explanation.append([feat_name, weight])
            
            # Update explanation to use real names
            explanation = cleaned_explanation

        if explanation:
            # Generate Heatmap
            print(f"DEBUG: Generating heatmap with {len(explanation)} features.")
            
            from utils.visualization import generate_topomap
            try:
                heatmap_b64 = generate_topomap(explanation, standard_channels)
                print(f"DEBUG: Heatmap generated? {'YES' if heatmap_b64 else 'NO'}")
            except Exception as e:
                print(f"DEBUG: Heatmap Error: {e}")
                heatmap_b64 = None
        else:
            heatmap_b64 = None

        output_payload = {
            "status": "success",
            "prediction": stress_level,
            "stress_score": stress_score,
            "filename": file.filename,
            "model_used": model, # Explicit confirmation
            "visualizations": {
                "signal": viz_signal,
                "freq": viz_freq
            },
            "explanation": explanation,
            "heatmap": heatmap_b64,
            "details": f"Analyzed {n_secs} seconds of data. Explained Peak at {peak_idx}s."
        }
        
        # DEBUG OUTPUT TO LOG
        lime_list = output_payload["explanation"]
        logging.info(f"\n--- DEBUG: PREDICTION COMPARISON ---")
        logging.info(f"Final Stress Score (Peak): {stress_score:.4f}")
        logging.info("LIME Explanation (All 10 Features):")
        if lime_list:
            for item in lime_list:
                logging.info(f"  {item[0]:<20} : {item[1]:+.4f}")
        logging.info("------------------------------------\n")

        return output_payload


    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
