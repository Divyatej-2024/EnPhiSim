import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Consent.css';

export default function Consent() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleConsent = async () => {
    // Record consent in backend
    await fetch(`${process.env.REACT_APP_API_URL}/api/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agreed: true,
        timestamp: new Date().toISOString(),
        sessionId: localStorage.getItem('sessionId') || generateSessionId()
      })
    });
    
    navigate('/simulator');
  };

  return (
    <div className="consent-container">
      <div className="university-header">
        <h1>Teesside University</h1>
        <h2>School of Computing, Engineering & Digital Technologies</h2>
        <p>Ethics Reference: 2025 Oct 31565 PENDELA</p>
        <p>Supervisor: Dr. Diyan Muhammad (m.diyan@tees.ac.uk)</p>
        <p>Researcher: Divya Tej Pendela (d3604526@live.tees.ac.uk)</p>
      </div>

      <div className="consent-content">
        <h3>Informed Consent for Research Participation</h3>
        
        <section>
          <h4>Study Purpose</h4>
          <p>This research evaluates how users interact with phishing simulations and compares the effectiveness of DistilBERT vs CNN machine learning classifiers in detecting phishing attempts.</p>
        </section>

        <section>
          <h4>What Participation Involves</h4>
          <ul>
            <li>You will complete a series of phishing simulation levels</li>
            <li>Each level presents email scenarios requiring decisions</li>
            <li>Your choices and response times are recorded</li>
            <li>The ML model provides real-time feedback on your decisions</li>
            <li>Total time: approximately 15-20 minutes</li>
          </ul>
        </section>

        <section>
          <h4>Data Collection & Privacy</h4>
          <p><strong>NO personal identifiers are collected:</strong></p>
          <ul>
            <li>✅ No names, emails, or IP addresses</li>
            <li>✅ No browser fingerprints or tracking cookies</li>
            <li>✅ Only anonymous interaction data: scenario choices, response times, ML predictions</li>
            <li>✅ All data stored in MongoDB Atlas with encryption</li>
            <li>✅ Data retained for 12 months, then permanently deleted</li>
          </ul>
        </section>

        <section>
          <h4>Your Rights</h4>
          <ul>
            <li>✅ Participation is completely voluntary</li>
            <li>✅ You may withdraw at ANY time by closing your browser</li>
            <li>✅ To withdraw already submitted data: email d3604526@live.tees.ac.uk with your session date/time</li>
            <li>✅ No consequences for withdrawal</li>
          </ul>
        </section>

        <section>
          <h4>Contact</h4>
          <p>Questions about the research: d3604526@live.tees.ac.uk</p>
          <p>Ethics concerns: m.diyan@tees.ac.uk</p>
        </section>

        <label className="consent-checkbox">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I have read and understood the information above and agree to participate in this research study under the terms described.
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
  );
}

function generateSessionId() {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('sessionId', id);
  return id;
}