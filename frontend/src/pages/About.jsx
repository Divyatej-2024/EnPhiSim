import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-icon" aria-hidden="true">
          <span className="orbital-node center" />
          <span className="orbital-node one" />
          <span className="orbital-node two" />
          <span className="orbital-ring" />
        </div>
        <h1 className="about-title">About EnPhiSim</h1>

        <div className="about-content">
          <div className="about-section">
            <p>
              <strong>EnPhiSim (Enhanced Phishing Simulation)</strong> is an interactive
              walkthrough cybersecurity learning platform designed to raise awareness and
              train users to identify and respond to phishing attacks in real time.
            </p>
          </div>

          <div className="about-section">
            <p>
              In today's digital world, phishing remains one of the most common and
              effective cyberattack methods. EnPhiSim bridges the gap between theory and
              practice by simulating real-world phishing scenarios where users learn by
              doing. Each level represents a unique phishing vector - from deceptive emails
              to malicious web pages - helping users build critical thinking and detection
              skills essential for modern cybersecurity defense.
            </p>
          </div>

          <div className="about-section highlight">
            <h3>Machine Learning Integration</h3>
            <p>
              The platform integrates <strong>machine learning models</strong> for
              phishing detection, demonstrating how intelligent systems can analyze message
              patterns and behaviors to prevent attacks before they reach users.
              EnPhiSim not only trains individuals but also helps organizations test and
              enhance their employee security awareness programs.
            </p>
          </div>

          <div className="about-section">
            <p>
              Join the simulation, challenge yourself, and strengthen your defense against
              social engineering threats.
            </p>
          </div>
        </div>

        <div className="about-actions">
          <button onClick={() => navigate("/game")} className="btn btn-primary">
            <span>Start Training</span>
            <span className="cta-motion" aria-hidden="true" />
          </button>
          <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
