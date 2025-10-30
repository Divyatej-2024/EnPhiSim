from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "ML Server running ✅"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')
    
    # Example mock prediction
    if "login" in text.lower() or "password" in text.lower():
        prediction = "Phishing"
    else:
        prediction = "Legitimate"
    
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
