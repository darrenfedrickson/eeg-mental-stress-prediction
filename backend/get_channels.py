import re

path = "models/selected_features_freqband.pkl"

with open(path, "rb") as f:
    content = f.read().decode('latin1')
    matches = re.findall(r'(Ch\d+)_', content) # Look for Ch1_, Ch12_, etc.
    unique_channels = sorted(list(set(matches)), key=lambda x: int(x[2:]))
    print("CHANNELS:", unique_channels)
