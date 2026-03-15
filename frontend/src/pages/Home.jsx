// Sections: imports, configuration, logic, render/exports

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("consentGiven");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleStart = () => {
    const consent = localStorage.getItem("consentGiven");
    if (consent === "true") {
      navigate("/disclaimer");
    } else {
      setShowConsent(true);
    }
  };

  const handleConsent = () => {
    localStorage.setItem("consentGiven", "true");
    setShowConsent(false);
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-badge">
          <span className="hero-badge-pulse" aria-hidden="true" />
          <span>Cybersecurity Training Platform</span>
        </div>

        <img
          src={`${process.env.PUBLIC_URL}/Enphisim.png`}
          alt="EnPhiSim Logo"
          className="hero-logo"
        />

        <h1 className="hero-title">
          Welcome to <span className="text-gradient">EnPhiSim</span>
        </h1>

        <p className="hero-subtitle">
          Enhanced Phishing Simulation - Train your eye to detect cyber threats
          through interactive, AI-powered scenarios.
        </p>

        <div className="hero-features">
          <div className="feature-tag">
            <span className="feature-icon orbit" aria-hidden="true" />
            <span>39 Levels</span>
          </div>
          <div className="feature-tag">
            <span className="feature-icon wave" aria-hidden="true" />
            <span>AI Analysis</span>
          </div>
          <div className="feature-tag">
            <span className="feature-icon bars" aria-hidden="true" />
            <span>Live Dashboard</span>
          </div>
        </div>

        <button onClick={handleStart} className="hero-cta">
          <span>Let's Begin</span>
          <span className="cta-motion" aria-hidden="true" />
        </button>
      </div>

      {showConsent && (
        <div className="consent-overlay">
          <div className="consent-modal">
            <h2 className="modal-title">Informed Consent - Research Study</h2>

            <p className="modal-text">
              This platform simulates phishing attack scenarios to evaluate user
              decision-making behaviour and compare machine learning classifiers
              including DistilBERT and CNN.
            </p>

            <p className="modal-text">
              The system records anonymous interaction data such as responses,
              timestamps, and behavioural classifications. No personal
              identifiers are collected.
            </p>

            <p className="modal-text">
              Participation is voluntary. You may withdraw at any time by
              clearing your browser storage.
            </p>

            <label className="modal-checkbox">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span>
                I have read and understood the above information and consent to
                anonymous data processing.
              </span>
            </label>

            <button
              disabled={!checked}
              onClick={handleConsent}
              className={`modal-submit ${checked ? "active" : ""}`}
            >
              Start Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
