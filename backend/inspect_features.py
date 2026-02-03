import joblib
import os

path = "models/selected_features_freqband.pkl"
if os.path.exists(path):
    print(f"Loading {path}...")
    features = joblib.load(path)
    print("Feature Names:")
    print(features)
    
    # Extract unique channel names
    # Assuming format ChX_Feature or Name_Feature
    channels = set()
    for f in features:
        parts = f.split('_')
        if len(parts) > 0:
            channels.add(parts[0])
            
    print("\nDetected Channels in Model:")
    print(sorted(list(channels)))
else:
    print(f"File not found: {path}")
