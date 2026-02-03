import re
path = "models/selected_features_hjorth.pkl"
with open(path, "rb") as f:
    c=f.read().decode('latin1')
    ch=set(re.findall(r'(Ch\d+)_', c))
    print(f"LEN:{len(ch)}")
    print(sorted(list(ch), key=lambda x: int(x[2:])))
