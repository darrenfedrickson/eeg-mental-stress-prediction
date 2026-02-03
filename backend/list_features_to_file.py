import re
import os

path = "models/selected_features_hjorth.pkl"
outfile = "required_features.txt"

GOLDEN_IDS = {'Ch3', 'Ch4', 'Ch5', 'Ch8', 'Ch14', 'Ch30', 'Ch31', 'Ch32'}

with open(path, "rb") as f:
    content = f.read().decode('latin1')
    # Find features
    matches = re.findall(r'(Ch\d+_[A-Za-z]+)', content)
    unique_feats = sorted(list(set(matches)))
    
    with open(outfile, "w", encoding="utf-8") as out:
        out.write(f"Total Features Required: {len(unique_feats)}\n")
        out.write("--------------------------------\n")
        params_present = 0
        for feat in unique_feats:
            ch_id = feat.split('_')[0]
            status = "OK" if ch_id in GOLDEN_IDS else "MISSING"
            if status == "OK": params_present += 1
            out.write(f"{feat:<20} : {status}\n")
            
        out.write("--------------------------------\n")
        out.write(f"Features Present: {params_present}/{len(unique_feats)}\n")
        out.write(f"Features Missing: {len(unique_feats) - params_present}\n")
