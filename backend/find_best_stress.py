import os
import requests
import io
import time

# Configuration
API_URL = "http://localhost:8000/predict"
# DATA_DIR = r"C:\Users\darry\OneDrive\Desktop\FYP\EEG Processing Pipeline\eeg-stress-detection\Data\ica_filtered_data"
# Use the path provided by the user
DATA_DIR = r"C:\Users\darry\OneDrive\Desktop\FYP\EEG Processing Pipeline\eeg-stress-detection\Data\ica_filtered_data"

MODEL_TYPE = "hjorth" # Using the best model

from concurrent.futures import ThreadPoolExecutor, as_completed

def process_file(filename):
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'rb') as f:
            files_payload = {'file': (filename, f, 'application/octet-stream')}
            data_payload = {'model': MODEL_TYPE}
            
            response = requests.post(API_URL, files=files_payload, data=data_payload)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    return {
                        'filename': filename,
                        'score': data.get('stress_score'),
                        'prediction': data.get('prediction')
                    }
    except Exception:
        pass
    return None

def scan_files():
    if not os.path.exists(DATA_DIR):
        print(f"Error: Directory not found: {DATA_DIR}")
        return []

    results = []
    
    # Get all .mat files
    files = [f for f in os.listdir(DATA_DIR) if f.endswith('.mat') or f.endswith('.csv')]
    total_files = len(files)
    
    print(f"🚀 Found {total_files} files. Starting parallel scan (5 concurrent requests)...")

    with ThreadPoolExecutor(max_workers=10) as executor:  # Increased workers
        future_to_file = {executor.submit(process_file, f): f for f in files}
        
        for idx, future in enumerate(as_completed(future_to_file)):
            res = future.result()
            if res:
                results.append(res)
                if idx % 10 == 0:
                    print(f"[{idx+1}/{total_files} processed] Last: {res['filename']} -> {res['prediction']} ({res['score']:.4f})")
    
    return results

def find_best_candidates(results):
    print("\n" + "="*50)
    print("ANALYSIS RESULTS")
    print("="*50)

    # Low Stress: Score close to 0 (lowest)
    low_stress = sorted([r for r in results if r['prediction'] == 'Low'], key=lambda x: x['score'])
    
    # High Stress: Score typicaly > 1.5 (highest)
    high_stress = sorted([r for r in results if r['prediction'] == 'High'], key=lambda x: x['score'], reverse=True)
    
    # Medium Stress: Score close to 1.0
    medium_stress = sorted([r for r in results if r['prediction'] == 'Medium'], key=lambda x: abs(x['score'] - 1.0))

    print("\n🏆 BEST LOW STRESS CANDIDATES (Lowest Score):")
    for r in low_stress[:5]:
        print(f"  - {r['filename']}: Score {r['score']:.4f}")

    print("\n🏆 BEST MEDIUM STRESS CANDIDATES (Closest to 1.0):")
    for r in medium_stress[:5]:
        print(f"  - {r['filename']}: Score {r['score']:.4f}")

    print("\n🏆 BEST HIGH STRESS CANDIDATES (Highest Score):")
    for r in high_stress[:5]:
        print(f"  - {r['filename']}: Score {r['score']:.4f}")

if __name__ == "__main__":
    results = scan_files()
    if results:
        find_best_candidates(results)
