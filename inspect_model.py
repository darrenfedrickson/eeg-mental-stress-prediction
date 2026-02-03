import torch
import os

model_path = "backend/models/anfis_3level_model.pth"
if os.path.exists(model_path):
    try:
        state_dict = torch.load(model_path)
        print("Keys:", state_dict.keys())
        for key, val in state_dict.items():
            print(f"{key}: {val.shape}")
    except Exception as e:
        print(e)
else:
    print("File not found")
