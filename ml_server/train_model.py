import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizer, DistilBertModel
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pandas as pd
from preprocess import preprocess_txt


# ===============================
# Custom Dataset
# ===============================
class TextDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
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
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'label': torch.tensor(label, dtype=torch.long)
        }


# ===============================
# Model (DistilBERT + CNN)
# ===============================
class DistilBERT_CNN(nn.Module):
    def __init__(self, num_classes=3):
        super(DistilBERT_CNN, self).__init__()
        self.bert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.conv1 = nn.Conv1d(in_channels=768, out_channels=256, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(kernel_size=2)
        self.fc = nn.Linear(256 * (128 // 2), num_classes)
        self.dropout = nn.Dropout(0.3)

    def forward(self, input_ids, attention_mask):
        bert_out = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        x = bert_out.last_hidden_state               # [batch, seq_len, hidden_dim]
        x = x.permute(0, 2, 1)                       # [batch, hidden_dim, seq_len]
        x = torch.relu(self.conv1(x))
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = self.dropout(x)
        x = self.fc(x)
        return x


# ===============================
# Training Loop
# ===============================
def train():
    # Load and preprocess data
    df = preprocess_txt("data/Enphisim_dataset.xlsx")
    label_map = {"correct": 0, "neutral": 1, "wrong": 2}
    df["label"] = df["label"].map(label_map)

    train_texts, test_texts, train_labels, test_labels = train_test_split(
        df["text"].tolist(), df["label"].tolist(), test_size=0.2, random_state=42
    )

    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

    train_dataset = TextDataset(train_texts, train_labels, tokenizer)
    test_dataset = TextDataset(test_texts, test_labels, tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=4)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = DistilBERT_CNN(num_classes=3).to(device)
    optimizer = optim.Adam(model.parameters(), lr=2e-5)
    criterion = nn.CrossEntropyLoss()

    EPOCHS = 3
    model.train()

    for epoch in range(EPOCHS):
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

        print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {total_loss/len(train_loader):.4f}")

    # ===============================
    # Evaluation
    # ===============================
    model.eval()
    preds, trues = [], []

    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            outputs = model(input_ids, attention_mask)
            pred = torch.argmax(outputs, dim=1)
            preds.extend(pred.cpu().numpy())
            trues.extend(labels.cpu().numpy())

    print("\nClassification Report:\n", classification_report(trues, preds, target_names=label_map.keys()))

    # ===============================
    # Save Model and Tokenizer
    # ===============================
    save_dir = "models/distilbert_cnn_options"
    tokenizer.save_pretrained(save_dir)
    torch.save(model.state_dict(), f"{save_dir}/model.pt")
    print(f"\nModel and tokenizer saved to {save_dir}")


if __name__ == "__main__":
    train()
