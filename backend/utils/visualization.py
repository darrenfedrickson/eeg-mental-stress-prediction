import mne
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

def generate_topomap(lime_explanation, standard_channels):
    """
    Generates a HEAD HEATMAP from LIME feature weights.
    
    Args:
        lime_explanation: List of [feature_name, weight]
                          e.g. [['Ch1_Beta', 0.001], ['Ch2_Gamma', -0.002]]
        standard_channels: List of 32 standard channel names (e.g. ['Fp1', 'AF3'...])
                           Must match the order of 'Ch1', 'Ch2'...
    
    Returns:
        base64_string: PNG image of the topomap
    """
    try:
        # Use Agg backend to prevent GUI errors on server
        plt.switch_backend('Agg')
        
        # 1. Initialize Weights per Channel
        # Default to 0.0 for all 32 channels
        channel_weights = np.zeros(len(standard_channels))
        
        # 2. Map Features to Channels
        # Features are named "ChX_Beta", "ChY_Gamma", etc.
        # We need to sum contributions for each channel.
        print("DEBUG: Generating Heatmap...") # Reduced noise
        
        for feat_name, weight in lime_explanation:
            # Parse "Ch1_Beta" or "Fz_Beta" -> "Fz"
            # Assuming format "<Name>_<Band>"
            if "_" in feat_name:
                parts = feat_name.split("_")
                prefix = parts[0] # "Ch1" or "Fz"
                
                # Method 1: Check for "ChX"
                if prefix.startswith("Ch") and prefix[2:].isdigit():
                    try:
                        idx_str = prefix.replace("Ch", "")
                        ch_idx = int(idx_str) - 1 # 0-indexed
                        if 0 <= ch_idx < len(channel_weights):
                            channel_weights[ch_idx] += weight
                        continue
                    except ValueError:
                        pass
                
                # Method 2: Check for Standard Name (e.g. "Fz")
                if prefix in standard_channels:
                    ch_idx = standard_channels.index(prefix)
                    channel_weights[ch_idx] += weight

        # 3. Create MNE Layout
        # Use standard 1005 montage which covers extended channels like FT9, PO9
        montage = mne.channels.make_standard_montage('standard_1005')
        
        # Filter montage to only our 32 channels
        # We need an Info object
        info = mne.create_info(ch_names=standard_channels, sfreq=128, ch_types='eeg')
        
        # Determine valid channels in montage
        # If some are missing (e.g. custom names), we should exclude them to prevent crash
        valid_ch_names = [ch for ch in standard_channels if ch in montage.ch_names]
        if len(valid_ch_names) != len(standard_channels):
             print(f"Warning: {len(standard_channels) - len(valid_ch_names)} channels missing from montage.")
        
        # Set montage (match_case=False is safer if available, but standard is strict)
        try:
            info.set_montage(montage, on_missing='ignore') 
        except:
             # Fallback for older MNE versions
             info.set_montage(montage)

        
        # 4. Plot
        fig, ax = plt.subplots(figsize=(10, 10))
        
        # Plot topomap
        # cmap="RdBu_r" -> Red=Positive (Stress), Blue=Negative (Relax)
        # Using specific vmin/vmax to keep colors consistent?
        # Let's auto-scale but center on 0.
        max_abs = np.max(np.abs(channel_weights))
        if max_abs == 0: max_abs = 1 # Avoid div/0
        
        mne.viz.plot_topomap(channel_weights, info, axes=ax, show=False, 
                             cmap="RdBu_r",
                             contours=0, # Smooth heatmap
                             names=standard_channels, 
                             extrapolate='head',
                             sphere=0.09) # Standard head size
                             
        # plt.title("Stress Contribution Map", fontsize=18, pad=30) # Removed per user request
        
        # 5. Save to Base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', transparent=True)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        
        return f"data:image/png;base64,{img_str}"
        
    except Exception as e:
        print(f"Error generating topomap: {e}")
        return None
