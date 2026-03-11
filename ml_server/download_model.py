# ml_server/download_model.py
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
import torch
import os
import sys

print("="*60)
print("EnPhiSim ML Server - Model Downloader")
print("="*60)

# Create models directory
os.makedirs('models', exist_ok=True)

def download_with_transformers():
    """Download model using Hugging Face transformers (RECOMMENDED)"""
    print("\nUsing Hugging Face transformers...")
    
    try:
        # Download model
        print("   Downloading DistilBERT model (this may take 2-3 minutes)...")
        model = DistilBertForSequenceClassification.from_pretrained(
            'distilbert-base-uncased',
            num_labels=2,
            torch_dtype=torch.float32,
            low_cpu_mem_usage=True
        )
        print("Model downloaded successfully")
        
        # Download tokenizer
        print("   Downloading tokenizer...")
        tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        print("Tokenizer downloaded successfully")
        
        # Save model
        model_path = 'models/real_phishing_model.pt'
        print(f"Saving model to {model_path}...")
        torch.save(model.state_dict(), model_path)
        
        # Check file size
        file_size = os.path.getsize(model_path) / (1024 * 1024)
        print(f"File size: {file_size:.2f} MB")
        
        # Save tokenizer
        tokenizer.save_pretrained('models/tokenizer')
        print("Tokenizer saved to models/tokenizer")
        
        # Verify the file
        print("\nVerifying model file...")
        test_load = torch.load(model_path, map_location='cpu', weights_only=False)
        print("Model file is valid PyTorch format!")
        
        return True
        
    except Exception as e:
        print(f"\nERROR downloading with transformers: {e}")
        return False

def download_with_fallback():
    """Fallback method if transformers download fails"""
    print("\nUsing fallback download method...")
    
    import requests
    
    # Hugging Face direct download URL for DistilBERT
    url = "https://huggingface.co/distilbert-base-uncased/resolve/main/pytorch_model.bin"
    
    try:
        print(f"   Downloading from: {url}")
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Check if we got HTML instead of model
        content_type = response.headers.get('content-type', '')
        if 'text/html' in content_type:
            print("Got HTML response instead of model file")
            return False
            
        # Save file
        model_path = 'models/real_phishing_model.pt'
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    percent = (downloaded / total_size) * 100
                    print(f"\r   Progress: {percent:.1f}%", end='', flush=True)
        
        print()  # New line after progress
        
        # Check file size
        file_size = os.path.getsize(model_path) / (1024 * 1024)
        print(f"File size: {file_size:.2f} MB")
        
        if file_size < 100:
            print("File too small - likely corrupted")
            return False
            
        return True
        
    except Exception as e:
        print(f"Fallback download failed: {e}")
        return False

def main():
    """Main download function"""
    
    # Try transformers method first (recommended)
    if download_with_transformers():
        print("\n" + "="*60)
        print("SUCCESS! Model is ready to use.")
        print("="*60)
        return 0
    
    # Try fallback method
    print("\nTransformers download failed, trying fallback...")
    if download_with_fallback():
        print("\n" + "="*60)
        print("SUCCESS! Model downloaded with fallback method.")
        print("="*60)
        return 0
    
    # Both methods failed
    print("\n" + "="*60)
    print("ERROR: All download methods failed.")
    print("Please check your internet connection and try again.")
    print("="*60)
    return 1

if __name__ == "__main__":
    sys.exit(main())
