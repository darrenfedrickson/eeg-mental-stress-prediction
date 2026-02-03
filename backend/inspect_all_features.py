import re
import os

paths = ["models/selected_features_freqband.pkl", "models/selected_features_hjorth.pkl"]

for path in paths:
    if os.path.exists(path):
        print(f"\n--- {path} ---")
        try:
            with open(path, "rb") as f:
                content = f.read().decode('latin1')
                # Find feature strings like Ch1_Beta or Ch3_Complexity
                matches = re.findall(r'(Ch\d+_[A-Za-z]+)', content)
                unique_feats = sorted(list(set(matches)))
                print("Count:", len(unique_feats))
                print(unique_feats)
                
                # Check Channels
                ch_matches = re.findall(r'(Ch\d+)_', content)
                unique_channels = sorted(list(set(ch_matches)), key=lambda x: int(x[2:]))
                print("Channels:", unique_channels)
        except Exception as e:
            print(f"Error reading path: {e}")
