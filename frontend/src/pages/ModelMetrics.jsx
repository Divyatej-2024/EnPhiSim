// frontend/src/pages/ModelMetrics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ModelMetrics.css';

const API_BASE = process.env.REACT_APP_API_URL || 'https://enphisim-1.onrender.com';

export default function ModelMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // First try to get from ML server directly
      try {
        const response = await axios.get('https://enphisim-ml.onrender.com/metrics');
        setMetrics(response.data);
      } catch {
        // Fallback to backend proxy
        const response = await axios.get(`${API_BASE}/api/model-metrics`);
        setMetrics(response.data);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
      setError('Could not load model metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading model metrics...</div>;
  }

  if (error || !metrics) {
    return (
      <div className="error-screen">
        <h2>❌ Metrics Unavailable</h2>
        <p>{error || 'No metrics found'}</p>
        <button onClick={() => navigate('/game')}>Back to Game</button>
      </div>
    );
  }

  return (
    <div className="metrics-container">
      <h1>Model Performance Metrics</h1>
      <p className="model-description">Hybrid DistilBERT + CNN Phishing Detector</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Accuracy</h3>
          <div className="metric-value">{(metrics.accuracy * 100).toFixed(2)}%</div>
          <div className="metric-desc">Overall correctness</div>
        </div>

        <div className="metric-card">
          <h3>Precision</h3>
          <div className="metric-value">{(metrics.precision * 100).toFixed(2)}%</div>
          <div className="metric-desc">When model says phishing, how often right?</div>
        </div>

        <div className="metric-card">
          <h3>Recall</h3>
          <div className="metric-value">{(metrics.recall * 100).toFixed(2)}%</div>
          <div className="metric-desc">How many actual phishing emails caught?</div>
        </div>

        <div className="metric-card">
          <h3>F1-Score</h3>
          <div className="metric-value">{(metrics.f1 * 100).toFixed(2)}%</div>
          <div className="metric-desc">Harmonic mean of precision and recall</div>
        </div>
      </div>

      {metrics.confusion_matrix && (
        <div className="confusion-matrix">
          <h2>Confusion Matrix</h2>
          <div className="matrix-grid">
            <div className="matrix-cell tl">
              <div className="matrix-label">True Negatives</div>
              <div className="matrix-value">{metrics.confusion_matrix[0][0]}</div>
              <div className="matrix-desc">Correctly identified legitimate</div>
            </div>
            <div className="matrix-cell tr">
              <div className="matrix-label">False Positives</div>
              <div className="matrix-value">{metrics.confusion_matrix[0][1]}</div>
              <div className="matrix-desc">Legitimate marked as phishing</div>
            </div>
            <div className="matrix-cell bl">
              <div className="matrix-label">False Negatives</div>
              <div className="matrix-value">{metrics.confusion_matrix[1][0]}</div>
              <div className="matrix-desc">Phishing missed</div>
            </div>
            <div className="matrix-cell br">
              <div className="matrix-label">True Positives</div>
              <div className="matrix-value">{metrics.confusion_matrix[1][1]}</div>
              <div className="matrix-desc">Correctly identified phishing</div>
            </div>
          </div>
        </div>
      )}

      <div className="model-info">
        <h3>Model Architecture</h3>
        <ul>
          <li><strong>Base:</strong> DistilBERT (distilled BERT)</li>
          <li><strong>Classification:</strong> CNN layers on top of embeddings</li>
          <li><strong>Training data:</strong> 60 phishing + 20 legitimate emails</li>
          <li><strong>Test split:</strong> 80% train, 10% validation, 10% test</li>
        </ul>
      </div>

      <button className="back-btn" onClick={() => navigate('/game')}>
        Back to Game
      </button>
    </div>
  );
}