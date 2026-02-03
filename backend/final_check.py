import re
import os

path = "models/selected_features_hjorth.pkl"
with open(path, "rb") as f:
    content = f.read().decode('latin1')
    matches = re.findall(r'(Ch\d+)_', content)
    unique = sorted(list(set(matches)), key=lambda x: int(x[2:]))
    print("CHANNELS:", unique)
