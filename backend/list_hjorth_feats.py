import joblib
import os

path = "models/selected_features_hjorth.pkl"
features = joblib.load(path)
print("REQUIRED FEATURES (10):")
for f in features:
    print(f)
