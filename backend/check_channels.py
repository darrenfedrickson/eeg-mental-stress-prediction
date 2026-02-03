import re
import os

hjorth_path = "models/selected_features_hjorth.pkl"

GOLDEN_IDS = {'Ch3', 'Ch4', 'Ch5', 'Ch8', 'Ch14', 'Ch30', 'Ch31', 'Ch32'}

if os.path.exists(hjorth_path):
    with open(hjorth_path, "rb") as f:
        content = f.read().decode('latin1')
        matches = re.findall(r'(Ch\d+)_', content)
        hjorth_channels = set(matches)
        
        print(f"Hjorth Model uses {len(hjorth_channels)} channels.")
        print("Channels:", sorted(list(hjorth_channels), key=lambda x: int(x[2:])))
        
        missing = hjorth_channels - GOLDEN_IDS
        if missing:
             print("\nCRITICAL: The following channels are required but NOT in Golden 8:")
             print(sorted(list(missing), key=lambda x: int(x[2:])))
        else:
             print("\nAll required channels are present in Golden 8.")
        
        # Also let's just count features to match the error "4 features"
        # Find features in Golden 8
        feat_matches = re.findall(r'(Ch\d+_[A-Za-z]+)', content)
        unique_feats = set(feat_matches)
        print(f"\nTotal Features in Model: {len(unique_feats)}")
        
        present_feats = [f for f in unique_feats if f.split('_')[0] in GOLDEN_IDS]
        print(f"Features present with Golden 8: {len(present_feats)}")
        print("Present:", sorted(present_feats))
else:
    print("File not found")
