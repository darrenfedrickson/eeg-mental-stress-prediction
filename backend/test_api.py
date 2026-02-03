import requests
import json

url = "http://127.0.0.1:8000/predict"
file_path = r"C:\Users\darry\OneDrive\Desktop\FYP\Dataset\SAM-40\relax\Relax_sub_1.csv"

# Define your selected EEG channels (same as in frontend)
selected_channels = [4, 7, 30, 2, 29, 13, 31, 3]

with open(file_path, "rb") as f:
    files = {"file": (file_path, f, "text/csv")}
    data = {"channels": json.dumps(selected_channels)}
    response = requests.post(url, files=files, data=data)

print("Status code:", response.status_code)
print("Response text:", response.text)
