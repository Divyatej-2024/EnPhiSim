// frontend/src/pages/Consent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Consent.css';

export default function Consent() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  // Generate or retrieve session ID on component mount
  useEffect(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', id);
    }
    setSessionId(id);
  }, []);

  const handleConsent = async () => {
    if (!agreed) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Record consent in database (as per ethics requirement)
      await api.recordConsent({
        agreed: true,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent // For analytics only, not personal data
      });
      
      // Set consent flag
      localStorage.setItem('consentGiven', 'true');
      
      // Navigate to game
      navigate('/game');
    } catch (err) {
      console.error('Consent recording failed:', err);
      setError('Failed to record consent. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="consent-page">
      <div className="consent-container">
        {/* University Header - Ethics Requirement */}
        <div className="university-header">
          <h1>Teesside University</h1>
          <h2>School of Computing, Engineering & Digital Technologies</h2>
          <div className="ethics-badge">
            <span className="ethics-ref">Ethics Reference: 2025 Oct 31565 PENDELA</span>
          </div>
          <div className="supervisor-info">
            <p><strong>Supervisor:</strong> Dr. Diyan Muhammad (m.diyan@tees.ac.uk)</p>
            <p><strong>Researcher:</strong> Divya Tej Pendela (d3604526@live.tees.ac.uk)</p>
          </div>
        </div>

        {/* Main Consent Card */}
        <div className="consent-card">
          <h2>Informed Consent for Research Participation</h2>
          
          {/* Study Purpose - From Proposal Section 1 */}
          <div className="consent-section">
            <h3>📋 Study Purpose</h3>
            <p>
              This research evaluates how users interact with phishing simulations and compares the 
              effectiveness of <strong>DistilBERT vs CNN machine learning classifiers</strong> in 
              detecting phishing attempts. The study aims to develop a hybrid walkthrough phishing 
              simulator that enhances awareness while collecting data to improve detection algorithms.
            </p>
          </div>

          {/* What Participation Involves - From Proposal Section 5 */}
          <div className="consent-section">
            <h3>🎮 What Participation Involves</h3>
            <ul>
              <li>You will complete a series of <strong>39 phishing simulation levels</strong></li>
              <li>Each level contains <strong>60+ unique phishing scenarios</strong> across 12+ attack types</li>
              <li>You will make decisions about email legitimacy (Trust & Click, Ignore, Report Phish)</li>
              <li>The ML model provides <strong>real-time feedback</strong> on your decisions</li>
              <li>Total time: approximately <strong>15-20 minutes</strong> for full completion</li>
              <li>You can stop at any time and resume later (progress saved locally)</li>
            </ul>
          </div>

          {/* Data Collection & Privacy - Ethics Requirement */}
          <div className="consent-section">
            <h3>🔒 Data Collection & Privacy</h3>
            <p><strong>NO personal identifiers are collected:</strong></p>
            <div className="data-points">
              <div className="data-point">
                <span className="point-icon">✅</span>
                <span className="point-label">No names or emails</span>
              </div>
              <div className="data-point">
                <span className="point-icon">✅</span>
                <span className="point-label">No IP addresses</span>
              </div>
              <div className="data-point">
                <span className="point-icon">✅</span>
                <span className="point-label">No browser fingerprints</span>
              </div>
              <div className="data-point">
                <span className="point-icon">✅</span>
                <span className="point-label">No tracking cookies</span>
              </div>
            </div>
            
            <p><strong>What IS collected (anonymously):</strong></p>
            <ul>
              <li><strong>Scenario choices:</strong> Which action you selected (Trust/Ignore/Report)</li>
              <li><strong>Response times:</strong> How long you took to make each decision</li>
              <li><strong>ML predictions:</strong> Model outputs for comparison (DistilBERT vs CNN)</li>
              <li><strong>Session ID:</strong> Random identifier (cannot be traced to you)</li>
            </ul>

            <p><strong>Data Storage:</strong></p>
            <ul>
              <li>All data stored in <strong>MongoDB Atlas</strong> with encryption at rest and in transit</li>
              <li>Data retained for <strong>12 months</strong> after collection</li>
              <li>After 12 months, data is <strong>permanently deleted</strong> from all systems</li>
              <li>Access restricted to researcher and supervisor only</li>
            </ul>
          </div>

          {/* ML Model Explanation - From Proposal */}
          <div className="consent-section">
            <h3>🤖 Machine Learning Models</h3>
            <p>This study compares two ML architectures:</p>
            <div className="model-comparison">
              <div className="model-card">
                <h4>DistilBERT</h4>
                <p>Distilled BERT transformer - analyzes text context and semantics to detect phishing patterns</p>
              </div>
              <div className="model-card">
                <h4>CNN</h4>
                <p>Convolutional Neural Network - identifies structural patterns in email content and URLs</p>
              </div>
            </div>
            <p className="model-note">
              Your interactions help us evaluate which model performs better for different phishing types.
              Model performance metrics (accuracy, precision, recall, F1-score) will be published in the final report.
            </p>
          </div>

          {/* Your Rights - Ethics Requirement */}
          <div className="consent-section">
            <h3>⚖️ Your Rights</h3>
            <ul>
              <li><strong>Voluntary participation:</strong> You are free to participate or decline</li>
              <li><strong>Withdrawal at any time:</strong> You may stop by simply closing your browser</li>
              <li><strong>Data withdrawal:</strong> To withdraw already submitted data, email 
                <a href="mailto:d3604526@live.tees.ac.uk"> d3604526@live.tees.ac.uk</a> with your session ID: 
                <span className="session-id">{sessionId}</span>
              </li>
              <li><strong>No consequences:</strong> Withdrawal will not affect you in any way</li>
              <li><strong>Access to results:</strong> Final research findings available upon request</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="consent-section">
            <h3>📧 Contact</h3>
            <p><strong>Research questions:</strong> <a href="mailto:d3604526@live.tees.ac.uk">d3604526@live.tees.ac.uk</a></p>
            <p><strong>Ethics concerns:</strong> <a href="mailto:m.diyan@tees.ac.uk">m.diyan@tees.ac.uk</a></p>
            <p><strong>Data protection officer:</strong> <a href="mailto:dpo@tees.ac.uk">dpo@tees.ac.uk</a></p>
          </div>

          {/* Consent Checkbox */}
          <label className="consent-checkbox">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
            />
            <span>
              I have read and understood the information above. I agree to participate in this research 
              study under the terms described, with the understanding that my data will be processed 
              anonymously and I can withdraw at any time.
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {/* Enter Button */}
          <button 
            onClick={handleConsent}
            disabled={!agreed || loading}
            className={`enter-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Recording Consent...' : 'Enter Simulator'}
          </button>

          {/* Session Info */}
          <div className="session-info">
            <p>Your session ID: <span className="session-id-display">{sessionId}</span></p>
            <p className="session-note">Save this ID if you wish to withdraw your data later.</p>
          </div>
        </div>

        {/* Footer with Ethics Reference */}
        <div className="consent-footer">
          <p>This research has been approved by the Teesside University School of Computing, Engineering & Digital Technologies Ethics Committee.</p>
          <p>Approval reference: SCEDT-2025-10-31565-PENDELA | Date: October 30, 2025</p>
        </div>
      </div>
    </div>
  );
}