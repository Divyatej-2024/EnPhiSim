# ml_server/train_model.py
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from transformers import DistilBertTokenizer, DistilBertModel
import numpy as np
import json
import os
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import seaborn as sns

# Load environment variables
load_dotenv()

# ==================== MODEL DEFINITION ====================
class HybridPhishingClassifier(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.distilbert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.dropout = nn.Dropout(0.3)
        
        self.conv1 = nn.Conv1d(768, 256, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(256, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)
        self.fc1 = nn.Linear(128 * 64, 256)
        self.fc2 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU()
        
    def forward(self, input_ids, attention_mask):
        outputs = self.distilbert(input_ids=input_ids, attention_mask=attention_mask)
        embeddings = outputs.last_hidden_state
        embeddings = embeddings.permute(0, 2, 1)
        
        conv1_out = self.relu(self.conv1(embeddings))
        pool1_out = self.pool(conv1_out)
        conv2_out = self.relu(self.conv2(pool1_out))
        pool2_out = self.pool(conv2_out)
        
        flattened = pool2_out.view(pool2_out.size(0), -1)
        fc1_out = self.relu(self.fc1(flattened))
        fc1_out = self.dropout(fc1_out)
        logits = self.fc2(fc1_out)
        
        return logits


# ==================== DATASET CLASS ====================
class PhishingDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len
        
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_len,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'label': torch.tensor(label, dtype=torch.long)
        }


# ==================== LOAD DATA FROM MONGODB ATLAS ====================
def load_data_from_mongodb():
    """Load phishing emails from MongoDB Atlas"""
    
    # Get MongoDB URI from environment variable
    mongodb_uri = os.getenv('MONGODB_URI')
    
    if not mongodb_uri:
        # Try to load from .env file
        from pathlib import Path
        env_path = Path('../backend/.env')
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    if line.startswith('MONGODB_URI'):
                        mongodb_uri = line.strip().split('=')[1]
                        break
    
    if not mongodb_uri:
        raise ValueError("MONGODB_URI not found. Please set it in environment or .env file")
    
    print(f"📡 Connecting to MongoDB Atlas...")
    client = MongoClient(mongodb_uri)
    db = client['EnPhiSimdb']
    collection = db['levelDataset']
    
    # Get all phishing scenarios
    print("📥 Fetching phishing scenarios...")
    phishing_scenarios = list(collection.find({}))
    print(f"✅ Found {len(phishing_scenarios)} phishing scenarios")
    
    texts = []
    labels = []
    
    # Add phishing emails (label = 1)
    for s in phishing_scenarios:
        text = s.get('content', '') + ' ' + s.get('body_text', '')
        if text.strip():
            texts.append(text)
            labels.append(1)  # 1 = phishing
    
    client.close()
    
    # Load legitimate emails from JSON file
    try:
        legit_path = os.path.join(os.path.dirname(__file__), 'data/legitimate_emails.json')
        with open(legit_path, 'r') as f:
            legit_data = json.load(f)
            for item in legit_data:
                texts.append(item['text'])
                labels.append(0)  # 0 = legitimate
        print(f"✅ Loaded {len(legit_data)} legitimate emails from file")
    except FileNotFoundError:
        print("⚠️ No legitimate emails file found. Creating placeholder...")
        # Create placeholder file
        os.makedirs('data', exist_ok=True)
        placeholder = [
            {"text": "Your meeting is scheduled for tomorrow at 2 PM.", "label": "legitimate"},
            {"text": "Your password was successfully changed.", "label": "legitimate"},
            {"text": "Thank you for your purchase. Your order is confirmed.", "label": "legitimate"}
        ]
        with open(legit_path, 'w') as f:
            json.dump(placeholder, f, indent=2)
        for item in placeholder:
            texts.append(item['text'])
            labels.append(0)
        print(f"✅ Created {len(placeholder)} placeholder legitimate emails")
    
    return texts, labels


def check_class_distribution(labels):
    """Check if we have enough samples in each class"""
    unique, counts = np.unique(labels, return_counts=True)
    class_counts = dict(zip(unique, counts))
    
    print("\n📊 Class Distribution:")
    for cls, count in class_counts.items():
        print(f"  - Class {cls}: {count} samples")
        if count < 10:
            print(f"    ⚠️  Warning: Very few samples ({count})")
        if count < 2:
            raise ValueError(f"Class {cls} has only {count} samples. Need at least 2 to split.")
    
    return class_counts


# ==================== TRAINING FUNCTION ====================
def train_model(model, train_loader, val_loader, epochs=15, lr=2e-5):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    print(f"🖥️ Using device: {device}")
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()
    
    train_losses = []
    val_accuracies = []
    
    for epoch in range(epochs):
        # Training
        model.train()
        total_loss = 0
        
        for batch in train_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            
            optimizer.zero_grad()
            outputs = model(input_ids, attention_mask)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        avg_loss = total_loss / len(train_loader)
        train_losses.append(avg_loss)
        
        # Validation
        model.eval()
        all_preds = []
        all_labels = []
        
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['label'].to(device)
                
                outputs = model(input_ids, attention_mask)
                _, preds = torch.max(outputs, 1)
                
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
        
        accuracy = accuracy_score(all_labels, all_preds)
        val_accuracies.append(accuracy)
        
        print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f} - Val Accuracy: {accuracy:.4f}")
    
    return model, train_losses, val_accuracies


# ==================== EVALUATE MODEL ====================
def evaluate_model(model, test_loader):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.eval()
    
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            
            outputs = model(input_ids, attention_mask)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds, average='binary', zero_division=0)
    recall = recall_score(all_labels, all_preds, average='binary', zero_division=0)
    f1 = f1_score(all_labels, all_preds, average='binary', zero_division=0)
    cm = confusion_matrix(all_labels, all_preds)
    
    print("\n" + "="*50)
    print("FINAL MODEL EVALUATION")
    print("="*50)
    print(f"Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Precision: {precision:.4f} ({precision*100:.2f}%)")
    print(f"Recall:    {recall:.4f} ({recall*100:.2f}%)")
    print(f"F1-Score:  {f1:.4f} ({f1*100:.2f}%)")
    print("\nConfusion Matrix:")
    print(cm)
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'confusion_matrix': cm.tolist()
    }


# ==================== SAVE METRICS ====================
def save_metrics(metrics, filename='models/model_metrics.json'):
    os.makedirs('models', exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"✅ Metrics saved to {filename}")


# ==================== PLOT TRAINING HISTORY ====================
def plot_history(losses, accuracies):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    ax1.plot(losses)
    ax1.set_title('Training Loss')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    
    ax2.plot(accuracies)
    ax2.set_title('Validation Accuracy')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy')
    
    plt.tight_layout()
    plt.savefig('models/training_history.png')
    print("✅ Training history plot saved to models/training_history.png")


# ==================== MAIN ====================
def main():
    print("="*50)
    print("TRAINING REAL PHISHING DETECTION MODEL")
    print("="*50)
    
    # 1. Load data
    print("\n📥 Loading data...")
    texts, labels = load_data_from_mongodb()
    
    # Check class distribution
    unique, counts = np.unique(labels, return_counts=True)
    print(f"\n✅ Loaded {len(texts)} total samples")
    for cls, count in zip(unique, counts):
        print(f"  - Class {cls}: {count} samples")
    
    # Validate minimum samples
    if min(counts) < 2:
        print("\n⚠️  ERROR: One class has fewer than 2 samples!")
        print("Cannot perform train/validation/test split.")
        print("\nPlease add more data to the minority class:")
        if counts[0] < 2:  # Assuming class 0 is legitimate
            print("  - Add more legitimate emails to data/legitimate_emails.json")
        else:  # Class 1 is phishing
            print("  - Add more phishing emails to MongoDB")
        return
    
    # 2. Dynamic split based on dataset size
    min_class_size = min(counts)
    
    if min_class_size < 5:
        print(f"\n⚠️ Small dataset detected. Using 60/20/20 split")
        # Take 40% for temp (then split into 20% val + 20% test)
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, labels, test_size=0.4, random_state=42, stratify=labels
        )
        # Split temp equally into val and test
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
    elif min_class_size < 10:
        print(f"\n⚠️ Medium dataset detected. Using 70/15/15 split")
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, labels, test_size=0.3, random_state=42, stratify=labels
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
    else:
        print(f"\n✅ Good dataset size. Using 80/10/10 split")
        X_train, X_temp, y_train, y_temp = train_test_split(
            texts, labels, test_size=0.2, random_state=42, stratify=labels
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
        )
    
    print(f"\n📊 Final data split:")
    print(f"  - Train: {len(X_train)} samples")
    print(f"  - Validation: {len(X_val)} samples")
    print(f"  - Test: {len(X_test)} samples")
    
    # 3. Initialize tokenizer and model
    print("\n🤖 Initializing model...")
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    model = HybridPhishingClassifier(num_classes=2)
    
    # 4. Create data loaders
    train_dataset = PhishingDataset(X_train, y_train, tokenizer)
    val_dataset = PhishingDataset(X_val, y_val, tokenizer)
    test_dataset = PhishingDataset(X_test, y_test, tokenizer)
    
    train_loader = DataLoader(train_dataset, batch_size=4 if len(X_train) < 50 else 8, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=4)
    test_loader = DataLoader(test_dataset, batch_size=4)
    
    # 5. Train model
    print("\n🏋️ Training model...")
    model, losses, accuracies = train_model(model, train_loader, val_loader, epochs=15)
    
    # 6. Evaluate on test set
    print("\n📊 Evaluating model on test set...")
    metrics = evaluate_model(model, test_loader)
    
    # 7. Save model and metrics
    print("\n💾 Saving model...")
    torch.save(model.state_dict(), 'models/real_phishing_model.pt')
    save_metrics(metrics, 'models/model_metrics.json')
    
    # 8. Save comparison metrics
    comparison = {
        'distilbert_cnn': metrics,
        'note': 'Hybrid model combining DistilBERT embeddings with CNN layers'
    }
    save_metrics(comparison, 'models/model_comparison.json')
    
    # 9. Plot training history
    plot_history(losses, accuracies)
    
    print("\n" + "="*50)
    print("✅ TRAINING COMPLETE!")
    print("="*50)
    print("\n📈 Model Performance Summary:")
    print(f"  - Accuracy:  {metrics['accuracy']*100:.2f}%")
    print(f"  - Precision: {metrics['precision']*100:.2f}%")
    print(f"  - Recall:    {metrics['recall']*100:.2f}%")
    print(f"  - F1-Score:  {metrics['f1']*100:.2f}%")
    print("\n✅ Model saved to: models/real_phishing_model.pt")
    print("✅ Metrics saved to: models/model_metrics.json")


if __name__ == "__main__":
    main()