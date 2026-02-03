import re

path = "models/selected_features_freqband.pkl"

with open(path, "rb") as f:
    data = f.read()
    # Find all printable strings of length 4+ (since channel names like Fp1_ are short, but features are longer)
    # Actually, feature names look like "Fp1_Alpha" etc.
    # Let's look for standard patterns: [A-Za-z0-9]+_[A-Za-z0-9]+
    
    content = data.decode('latin1') # robust decode
    
    # Look for our known features
    # Pattern: Channel_Feature e.g. Fp1_Delta
    matches = re.findall(r'([A-Za-z0-9]{1,4}_[A-Za-z]+)', content)
    
    print("Found potential feature strings:")
    unique_channels = set()
    for m in matches:
        print(m)
        parts = m.split('_')
        if len(parts) == 2:
            unique_channels.add(parts[0])
            
    print("\nPotential Channels:")
    print(sorted(list(unique_channels)))
