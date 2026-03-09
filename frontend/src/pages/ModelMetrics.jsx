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
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.get('https://enphisim-ml.onrender.com/metrics');
        setMetrics(response.data);
      } catch {
        const response = await axios.get(`${API_BASE}/api/model-metrics`);
        setMetrics(response.data);
      }
    } catch (err) {
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

  const accuracy = metrics.accuracy ? (metrics.accuracy * 100).toFixed(2) : '—';
  const precision = metrics.precision ? (metrics.precision * 100).toFixed(2) : '—';
  const recall = metrics.recall ? (metrics.recall * 100).toFixed(2) : '—';
  const f1 = metrics.f1 ? (metrics.f1 * 100).toFixed(2) : '—';

  return (
    <div className="metrics-page">
      <div className="metrics-header">
        <div className="metrics-header-icon">🤖</div>
        <h1>ML Model Performance</h1>
        <p className="metrics-subtitle">
          Hybrid DistilBERT + CNN Phishing Detection System
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="metrics-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          🧮 Confusion Matrix
        </button>
        <button
          className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          🏗️ Architecture
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content fade-in">
          <div className="metrics-grid">
            <div className="metric-card accuracy">
              <div className="metric-icon">🎯</div>
              <h3>Accuracy</h3>
              <div className="metric-value">{accuracy}%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${accuracy}%` }}></div>
              </div>
              <div className="metric-desc">Overall correctness of predictions</div>
            </div>

            <div className="metric-card precision">
              <div className="metric-icon">🔍</div>
              <h3>Precision</h3>
              <div className="metric-value">{precision}%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${precision}%` }}></div>
              </div>
              <div className="metric-desc">When flagged as phishing, how often correct?</div>
            </div>

            <div className="metric-card recall">
              <div className="metric-icon">🛡️</div>
              <h3>Recall</h3>
              <div className="metric-value">{recall}%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${recall}%` }}></div>
              </div>
              <div className="metric-desc">How many actual threats were caught?</div>
            </div>

            <div className="metric-card f1">
              <div className="metric-icon">⚡</div>
              <h3>F1-Score</h3>
              <div className="metric-value">{f1}%</div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: `${f1}%` }}></div>
              </div>
              <div className="metric-desc">Harmonic mean of precision & recall</div>
            </div>
          </div>
        </div>
      )}

      {/* Confusion Matrix Tab */}
      {activeTab === 'matrix' && metrics.confusion_matrix && (
        <div className="tab-content fade-in">
          <div className="confusion-section">
            <h2 className="section-heading">Confusion Matrix</h2>
            <p className="section-desc">How well the model distinguishes phishing from legitimate emails</p>

            <div className="matrix-container">
              <div className="matrix-labels-top">
                <div></div>
                <div className="matrix-axis-label">Predicted Legitimate</div>
                <div className="matrix-axis-label">Predicted Phishing</div>
              </div>

              <div className="matrix-row">
                <div className="matrix-axis-label row-label">Actually Legitimate</div>
                <div className="matrix-cell tn">
                  <div className="matrix-cell-value">{metrics.confusion_matrix[0][0]}</div>
                  <div className="matrix-cell-label">True Negatives ✅</div>
                  <div className="matrix-cell-desc">Correctly cleared</div>
                </div>
                <div className="matrix-cell fp">
                  <div className="matrix-cell-value">{metrics.confusion_matrix[0][1]}</div>
                  <div className="matrix-cell-label">False Positives ⚠️</div>
                  <div className="matrix-cell-desc">False alarm</div>
                </div>
              </div>

              <div className="matrix-row">
                <div className="matrix-axis-label row-label">Actually Phishing</div>
                <div className="matrix-cell fn">
                  <div className="matrix-cell-value">{metrics.confusion_matrix[1][0]}</div>
                  <div className="matrix-cell-label">False Negatives 🚨</div>
                  <div className="matrix-cell-desc">Missed threat</div>
                </div>
                <div className="matrix-cell tp">
                  <div className="matrix-cell-value">{metrics.confusion_matrix[1][1]}</div>
                  <div className="matrix-cell-label">True Positives ✅</div>
                  <div className="matrix-cell-desc">Caught phishing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div className="tab-content fade-in">
          <div className="arch-section">
            <h2 className="section-heading">Model Architecture</h2>

            <div className="arch-pipeline">
              <div className="pipeline-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Input Layer</h4>
                  <p>Raw email text and metadata (sender, subject, body, links)</p>
                </div>
              </div>
              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>DistilBERT Encoder</h4>
                  <p>Tokenization + contextual embeddings (768-dim vectors per token)</p>
                </div>
              </div>
              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>CNN Classifier</h4>
                  <p>1D convolution layers extract local patterns from embeddings</p>
                </div>
              </div>
              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Output</h4>
                  <p>Phishing / Legitimate classification with confidence score</p>
                </div>
              </div>
            </div>

            <div className="arch-details">
              <div className="detail-card">
                <h4>📚 Training Data</h4>
                <p>60 phishing + 20 legitimate emails, augmented with synthetic variations</p>
              </div>
              <div className="detail-card">
                <h4>📐 Split Ratio</h4>
                <p>80% training, 10% validation, 10% test</p>
              </div>
              <div className="detail-card">
                <h4>🧠 Base Model</h4>
                <p>DistilBERT (distilled BERT) — 66M parameters, 6 transformer layers</p>
              </div>
              <div className="detail-card">
                <h4>⚙️ Classification Head</h4>
                <p>1D CNN layers with max-pooling + dense layers + softmax output</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="metrics-footer">
        <button className="btn-back" onClick={() => navigate('/game')}>
          ← Back to Simulation
        </button>
        <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
          📊 Dashboard
        </button>
      </div>
    </div>
  );
}