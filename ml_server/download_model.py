import requests
import os

def download_with_requests():
    url = "https://drive.google.com/uc?export=download&id=1u2hRYvBuoRFeUH0yBwJwB4oBJjRkSrZE"
    os.makedirs('models', exist_ok=True)
    
    print("Downloading model...")
    response = requests.get(url, stream=True)
    
    with open('models/real_phishing_model.pt', 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print("Download complete!")

if __name__ == "__main__":
    download_with_requests()