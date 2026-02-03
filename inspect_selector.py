import joblib
import pandas as pd
import numpy as np

try:
    selector = joblib.load("backend/models/selected_features_3level.pkl")
    print(f"Type: {type(selector)}")
    print(f"Content: {selector}")
    if hasattr(selector, 'dtype'):
        print(f"Dtype: {selector.dtype}")
except Exception as e:
    print(e)
