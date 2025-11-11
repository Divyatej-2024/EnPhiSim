import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import DistilBertModel

class DistilBERT_CNN(nn.Module):
    def __init__(self, num_classes=2):
        super(DistilBERT_CNN, self).__init__()
        self.bert = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.conv1 = nn.Conv1d(in_channels=768, out_channels=256, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(kernel_size=2)
        self.fc = nn.Linear(256 * (128 // 2), num_classes)
        self.dropout = nn.Dropout(0.3)

    def forward(self, input_ids, attention_mask):
        bert_out = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        x = bert_out.last_hidden_state              # [batch, seq_len, hidden_dim]
        x = x.permute(0, 2, 1)                      # [batch, hidden_dim, seq_len]
        x = F.relu(self.conv1(x))
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = self.dropout(x)
        x = self.fc(x)
        return x
