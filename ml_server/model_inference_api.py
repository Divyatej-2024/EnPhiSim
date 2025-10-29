from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "ML inference API is running!"})

if __name__ == "__main__":
    # Render dynamically assigns a port, so use it
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
