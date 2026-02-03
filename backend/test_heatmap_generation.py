import sys
import os

# Add current directory to path so we can import utils
sys.path.append(os.getcwd())

from utils.visualization import generate_topomap

# 1. Dummy Data (Simulating LIME output)
# Using mixture of ChX and Standard Names to test robustness
dummy_explanation = [
    ['Ch1_Beta', 0.005],   # Fp1 Stress (Red)
    ['Fz_Beta', 0.004],    # Fz Stress (Red)
    ['Oz_Alpha', -0.005],  # Oz Relax (Blue)
    ['Ch32_Gamma', 0.002]  # Fp2 Stress
]

# 2. Standard Channels (DEAP 32)
standard_channels = [
    "Cz", "Fz", "Fp1", "F7", "F3", "FC1", "C3", "FC5", 
    "FT9", "T7", "CP5", "CP1", "P3", "P7", "PO9", "O1", 
    "Pz", "Oz", "O2", "PO10", "P8", "P4", "CP2", "CP6", 
    "T8", "FT10", "FC6", "C4", "FC2", "F4", "F8", "Fp2"
]

print("--- TESTING HEATMAP GENERATION ---")
print(f"Features: {dummy_explanation}")

try:
    heatmap = generate_topomap(dummy_explanation, standard_channels)
    
    if heatmap and heatmap.startswith("data:image/png;base64"):
        print("\nSUCCESS! Heatmap generated.")
        print(f"Base64 Length: {len(heatmap)}")
        print("First 50 chars:", heatmap[:50])
    else:
        print("\nFAILURE: Heatmap returned None or invalid format.")
        
except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
