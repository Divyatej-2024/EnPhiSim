from transformers import DistilBertTokenizer, DistilBertModel
import torch

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
bert_model = DistilBertModel.from_pretrained('distilbert-base-uncased')

def tokenize_data(texts, max_len=128):
    return tokenizer(
        texts,
        truncation=True,
        padding=True,
        max_length=max_len,
        return_tensors='pt'
    )
