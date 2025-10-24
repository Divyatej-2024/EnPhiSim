<<<<<<< HEAD
# ml-server/utils/preprocess.py
import re

def preprocess_text(text):
    if not isinstance(text, str):
        return ''
    text = text.lower()
    text = re.sub(r'http\S+', ' ', text)  # remove links
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text
=======
# ml-server/utils/preprocess.py
import re

def preprocess_text(text):
    if not isinstance(text, str):
        return ''
    text = text.lower()
    text = re.sub(r'http\S+', ' ', text)  # remove links
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text
>>>>>>> 622a2f58a21cb608242fa59b8e4c35dfb00d67b0
