import joblib
import os
import sys

# Define absolute path to the backend/models directory where we COPIED the files
models_dir = r"c:\Users\darry\OneDrive\Desktop\FYP\eeg-mental-stress-prediction\backend\models"

print(f"Checking models in: {models_dir}")

for name in ["selected_features_freqband.pkl", "selected_features_hjorth.pkl"]:
    path = os.path.join(models_dir, name)
    print(f"\n--- Analyzing {name} ---")
    if os.path.exists(path):
        try:
            features = joblib.load(path)
            print(f"Count: {len(features)}")
            print("First 10 Features:", features[:10])
            
            # Check for keyword
            is_freq = any("Beta" in f or "Gamma" in f for f in features)
            is_hjorth = any("Mobility" in f or "Complexity" in f for f in features)
            
            print(f"Contains Band Features (Alpha/Beta/Gamma)? {is_freq}")
            print(f"Contains Hjorth Features (Mobility/Complexity)? {is_hjorth}")
            
        except Exception as e:
            print(f"Error reading pickle: {e}")
    else:
        print("File not found.")
