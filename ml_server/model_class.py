import torch
import torch.nn as nn
from transformers import DistilBertModel

class HybridPhishingClassifier(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.distilbert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.dropout = nn.Dropout(0.3)
        self.conv1 = nn.Conv1d(768, 256, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(256, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)
        self.fc1 = nn.Linear(128 * 128, 256)
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
