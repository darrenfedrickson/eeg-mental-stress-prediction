import numpy as np

def explain_prediction(model, features):
    """
    Placeholder for LIME explainability.
    Later you can integrate actual LIME explanations.
    """
    top_indices = np.argsort(np.abs(features))[-5:][::-1]
    return {
        "important_features": top_indices.tolist(),
        "weights": np.round(features[top_indices], 4).tolist()
    }
