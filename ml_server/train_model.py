# ml_server/train_real_model.py
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
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv

load_dotenv()

# ==================== MODEL DEFINITION ====================
class HybridPhishingClassifier(nn.Module):
    """
    Hybrid model combining DistilBERT embeddings with CNN classification
    """
    def __init__(self, num_classes=2):
        super().__init__()
        self.distilbert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.dropout = nn.Dropout(0.3)
        
        # CNN layers on top of DistilBERT embeddings
        self.conv1 = nn.Conv1d(768, 256, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(256, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)
        self.fc1 = nn.Linear(128 * 64, 256)  # Assuming max_len=512, after pooling: 128*64
        self.fc2 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU()
        
    def forward(self, input_ids, attention_mask):
        # Get DistilBERT embeddings
        outputs = self.distilbert(input_ids=input_ids, attention_mask=attention_mask)
        embeddings = outputs.last_hidden_state  # (batch, seq_len, 768)
        
        # Transpose for CNN (batch, channels, seq_len)
        embeddings = embeddings.permute(0, 2, 1)
        
        # CNN layers
        conv1_out = self.relu(self.conv1(embeddings))
        pool1_out = self.pool(conv1_out)
        conv2_out = self.relu(self.conv2(pool1_out))
        pool2_out = self.pool(conv2_out)
        
        # Flatten
        flattened = pool2_out.view(pool2_out.size(0), -1)
        
        # Fully connected layers
        fc1_out = self.relu(self.fc1(flattened))
        fc1_out = self.dropout(fc1_out)
        logits = self.fc2(fc1_out)
        
        return logits


# ==================== DATASET LOADER ====================
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


# ==================== LOAD DATA FROM MONGODB ====================
def load_data_from_mongodb():
    """Load phishing emails from MongoDB and combine with legitimate emails"""
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['EnPhiSimdb']
    collection = db['levelDataset']
    
    # Get all phishing scenarios
    phishing_scenarios = list(collection.find({}))
    
    texts = []
    labels = []
    
    # Add phishing emails (label = 1)
    for s in phishing_scenarios:
        text = s.get('content', '') + ' ' + s.get('body_text', '')
        if text.strip():
            texts.append(text)
            labels.append(1)  # 1 = phishing
    
    # Load legitimate emails from JSON file
    try:
        with open('data/legitimate_emails.json', 'r') as f:
            legit_data = json.load(f)
            for item in legit_data:
                texts.append(item['text'])
                labels.append(0)  # 0 = legitimate
        print(f"✅ Loaded {len(legit_data)} legitimate emails")
    except FileNotFoundError:
        print("⚠️ No legitimate emails found. Using only phishing data.")
        # Add some placeholder legitimate emails
        placeholder_legit = [
            "Your meeting is scheduled for tomorrow at 2 PM.",
            "Your password was successfully changed.",
            "Thank you for your purchase. Your order is confirmed."
        ]
        for text in placeholder_legit:
            texts.append(text)
            labels.append(0)
    
    client.close()
    return texts, labels


# ==================== TRAINING FUNCTION ====================
def train_model(model, train_loader, val_loader, epochs=10, lr=2e-5):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    
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
    all_probs = []
    
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            
            outputs = model(input_ids, attention_mask)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())
    
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds, average='binary')
    recall = recall_score(all_labels, all_preds, average='binary')
    f1 = f1_score(all_labels, all_preds, average='binary')
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
def save_metrics(metrics, filename='model_metrics.json'):
    with open(filename, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"✅ Metrics saved to {filename}")


# ==================== MAIN ====================
def main():
    print("="*50)
    print("TRAINING REAL PHISHING DETECTION MODEL")
    print("="*50)
    
    # 1. Load data
    print("\n📥 Loading data...")
    texts, labels = load_data_from_mongodb()
    print(f"Loaded {len(texts)} total samples")
    print(f"  - Phishing: {sum(labels)}")
    print(f"  - Legitimate: {len(labels) - sum(labels)}")
    
    # 2. Split data
    X_train, X_temp, y_train, y_temp = train_test_split(
        texts, labels, test_size=0.3, random_state=42, stratify=labels
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    print(f"\n📊 Data split:")
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
    
    train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=8)
    test_loader = DataLoader(test_dataset, batch_size=8)
    
    # 5. Train model
    print("\n🏋️ Training model...")
    model, losses, accuracies = train_model(model, train_loader, val_loader, epochs=15)
    
    # 6. Evaluate on test set
    print("\n📊 Evaluating model...")
    metrics = evaluate_model(model, test_loader)
    
    # 7. Save model and metrics
    print("\n💾 Saving model...")
    os.makedirs('models', exist_ok=True)
    torch.save(model.state_dict(), 'models/real_phishing_model.pt')
    save_metrics(metrics, 'models/model_metrics.json')
    
    # 8. Save for comparison (DistilBERT vs CNN - same model since hybrid)
    comparison = {
        'distilbert_cnn': metrics,
        'note': 'This is a hybrid model combining DistilBERT embeddings with CNN layers'
    }
    save_metrics(comparison, 'models/model_comparison.json')
    
    print("\n✅ Training complete! Model is now REAL and ready to deploy.")
    print("\nNext steps:")
    print("1. Update predict.js to use this model")
    print("2. Create a metrics page to display these numbers")
    print("3. Deploy the updated ML server")


if __name__ == "__main__":
    main()