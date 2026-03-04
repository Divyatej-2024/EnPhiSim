# ml_server/download_model.py
import os
import gdown
import sys

def download_model():
    """Download the trained model from Google Drive"""
    
    # Your Google Drive file ID (replace with yours)
    FILE_ID = "1u2hRYvBuoRFeUH0yBwJwB4oBJjRkSrZE"  # ← REPLACE THIS
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Check if model already exists
    if os.path.exists('models/real_phishing_model.pt'):
        file_size = os.path.getsize('models/real_phishing_model.pt') / (1024*1024)
        print(f"✅ Model already exists: {file_size:.2f} MB")
        return True
    
    print(f"📥 Downloading model from Google Drive...")
    print(f"File ID: {FILE_ID}")
    print("This may take a few minutes (263 MB)...")
    
    try:
        # Use gdown to download (handles large files better than wget/curl) [citation:4]
        url = f"https://drive.google.com/uc?id={FILE_ID}"
        output = 'models/real_phishing_model.pt'
        
        gdown.download(url, output, quiet=False)
        
        # Verify download
        if os.path.exists(output):
            file_size = os.path.getsize(output) / (1024*1024)
            print(f"✅ Download complete! Size: {file_size:.2f} MB")
            return True
        else:
            print("❌ Download failed - file not found")
            return False
            
    except Exception as e:
        print(f"❌ Download error: {e}")
        return False

if __name__ == "__main__":
    success = download_model()

    sys.exit(0 if success else 1)
