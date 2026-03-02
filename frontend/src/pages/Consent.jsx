import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Consent.css';

export default function Consent() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleConsent = async () => {
    if (!agreed) return;

    const sessionId =
      localStorage.getItem('sessionId') || generateSessionId();

    // Store consent locally first (so routing works immediately)
    localStorage.setItem("consentGiven", "true");

    // Redirect immediately (do not block UI on backend)
    navigate('/dashboard');

    // Send consent to backend (non-blocking)
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreed: true,
          timestamp: new Date().toISOString(),
          sessionId,
          consentVersion: "1.0",
          projectType: "Prototype Demonstration"
        })
      });
    } catch (error) {
      console.error("Consent logging failed:", error);
      // For prototype, do not interrupt user experience
    }
  };

  return (
    <div className="consent-page">
      <div className="consent-container">

        <div className="university-header">
          <h1>Teesside University</h1>
          <h2>School of Computing, Engineering & Digital Technologies</h2>
          <p>Ethics Reference: 2025 Oct 31565 PENDELA</p>
          <p>Supervisor: Dr. Diyan Muhammad</p>
          <p>Researcher: Divya Tej Pendela</p>
        </div>

        <div className="consent-card">
          <h2>Prototype Participation Information</h2>

          <section className="consent-section">
            <h3>Project Purpose</h3>
            <p>
              EnPhiSim is a prototype phishing simulation platform developed
              as part of a BSc Cybersecurity Final Year Project.
            </p>
            <p>
              It demonstrates phishing scenario interaction and integration
              of machine learning classifiers for automated feedback.
            </p>
          </section>

          <section className="consent-section">
            <h3>Participation</h3>
            <ul>
              <li>Simulated phishing email scenarios</li>
              <li>User decision-making tasks</li>
              <li>ML-based feedback demonstration</li>
              <li>Approximate duration: 15–20 minutes</li>
            </ul>
          </section>

          <section className="consent-section">
            <h3>Privacy</h3>
            <ul>
              <li>No personal identifiers intentionally collected</li>
              <li>No account registration required</li>
              <li>Anonymous interaction data only</li>
              <li>Stored securely for academic evaluation purposes</li>
            </ul>
          </section>

          <label className="consent-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to participate in this prototype demonstration.
          </label>

          <button
            onClick={handleConsent}
            disabled={!agreed}
            className="enter-button"
          >
            Enter Simulator
          </button>

        </div>
      </div>
    </div>
  );
}

function generateSessionId() {
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  const id = Array.from(array, (dec) => dec.toString(16)).join('');
  localStorage.setItem('sessionId', id);
  return id;
}