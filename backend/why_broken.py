import re
import os

hjorth_path = "models/selected_features_hjorth.pkl"

# Golden 8 IDs based on main.py mapping
GOLDEN_IDS = {'Ch3', 'Ch4', 'Ch5', 'Ch8', 'Ch14', 'Ch30', 'Ch31', 'Ch32'}

if os.path.exists(hjorth_path):
    with open(hjorth_path, "rb") as f:
        content = f.read().decode('latin1')
        matches = re.findall(r'(Ch\d+)_', content)
        hjorth_channels = set(matches)
        
        missing = hjorth_channels - GOLDEN_IDS
        
        print("\n--- CHANNEL REPORT ---")
        print(f"Goal: Running HJORTH model on Golden 8 Channels.")
        print(f"Golden 8 IDs: {sorted(list(GOLDEN_IDS), key=lambda x: int(x[2:]))}")
        print(f"Hjorth Requires: {sorted(list(hjorth_channels), key=lambda x: int(x[2:]))}")
        
        if missing:
             print("\n❌ MISSING CHANNELS (Reason for Error):")
             print(sorted(list(missing), key=lambda x: int(x[2:])))
        else:
             print("\n✅ All channels defined in model are present in Golden 8.")
             # If no channels missing, maybe feature names?
             feat_matches = re.findall(r'(Ch\d+_[A-Za-z]+)', content)
             print("\nRequired Features:")
             print(sorted(list(set(feat_matches))))
