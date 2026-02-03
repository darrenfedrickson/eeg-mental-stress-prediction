import joblib
import os

path = "models/selected_features_hjorth.pkl"

if os.path.exists(path):
    features = joblib.load(path)
    print("--- Loaded Features (Top 20) ---")
    print(features[:20])
    print(f"Total Features: {len(features)}")
else:
    print(f"File not found: {path}")
