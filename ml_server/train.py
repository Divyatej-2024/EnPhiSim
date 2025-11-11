import torch
import torch.nn as nn
from torch.optim import Adam
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from tqdm import tqdm
import pandas as pd
from utils import tokenizer
from model import DistilBERT_CNN

# Dataset class
class PhishDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
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

# Load data
df = pd.read_csv("phish_data.csv")
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df.text, df.label, test_size=0.2
)

train_dataset = PhishDataset(train_texts.tolist(), train_labels.tolist(), tokenizer)
val_dataset = PhishDataset(val_texts.tolist(), val_labels.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=8)

# Model, optimizer, loss
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = DistilBERT_CNN().to(device)
optimizer = Adam(model.parameters(), lr=2e-5)
criterion = nn.CrossEntropyLoss()

# Training
for epoch in range(3):
    model.train()
    total_loss = 0
    for batch in tqdm(train_loader):
        optimizer.zero_grad()
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['label'].to(device)
        outputs = model(input_ids, attention_mask)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1}, Loss: {total_loss / len(train_loader)}")

# Evaluation
model.eval()
preds, truths = [], []
with torch.no_grad():
    for batch in val_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['label'].to(device)
        outputs = model(input_ids, attention_mask)
        preds.extend(torch.argmax(outputs, dim=1).cpu().numpy())
        truths.extend(labels.cpu().numpy())

print(classification_report(truths, preds))

# Save model
torch.save(model.state_dict(), "distilbert_cnn_phish.pth")
print(" Model saved as distilbert_cnn_phish.pth")
