import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
  const [agreed, setAgreed] = useState(false);
  const nav = useNavigate();

  const handleProceed = () => {
    if (!agreed) return alert("Please agree to proceed.");
    nav("/about");
  };

  const handleClearData = () => {
    if (window.confirm("Clear local simulation data?")) {
      localStorage.removeItem("enphisim_actions");
      alert("Cleared.");
    }
  };

  return (
    <div className="disclaimer-page">
      <div className="disclaimer-container">
        <div className="disclaimer-icon" aria-hidden="true">
          <span className="shield-core" />
          <span className="shield-wave" />
        </div>
        <h1 className="disclaimer-title">EnPhiSim - Disclaimer</h1>

        <div className="disclaimer-content">
          <div className="disclaimer-section">
            <h3>Training-Only Simulation</h3>
            <p>
              Welcome to EnPhiSim - a training-only simulation environment. Every scenario,
              challenge, and simulated attack exists solely to train, demonstrate, and analyze
              cybersecurity threats in a safe, controlled setting.
            </p>
          </div>

          <div className="disclaimer-section">
            <h3>No Real Data</h3>
            <p>
              No real users, real content, or real credentials are used. All names, accounts,
              pages, and data presented inside EnPhiSim are synthetic or fictional and are
              generated for training purposes only. <strong>Do not enter any real personal
              information or credentials anywhere in the simulator.</strong>
            </p>
          </div>

          <div className="disclaimer-section">
            <h3>Original Branding</h3>
            <p>
              The logo and emblem used throughout EnPhiSim are original creations owned by
              the project. They must not be reused, modified, or redistributed without permission.
            </p>
          </div>

          <div className="disclaimer-section">
            <h3>Educational Purpose</h3>
            <p>
              This platform mimics attacker behavior (e.g., deceptive emails, fake login pages,
              social-engineering scenarios) strictly for educational, training, and assessment
              purposes. It is not intended for malicious use.
            </p>
          </div>

          <div className="disclaimer-section">
            <h3>Data Handling & Privacy</h3>
            <ul>
              <li>User actions and responses are stored locally on the device by default.</li>
              <li>Local data may be exported only for authorized evaluation, grading, or research purposes.</li>
              <li>EnPhiSim does not collect or transmit real user credentials or personal data to external servers.</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h3>Use & Responsibility</h3>
            <p>
              By using EnPhiSim you confirm that you understand its training-only nature and
              agree to use the tool responsibly and ethically for learning, testing, and research.
            </p>
          </div>
        </div>

        <label className="disclaimer-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed((value) => !value)}
          />
          <span>I agree to participate in this simulation (educational use only).</span>
        </label>

        <div className="disclaimer-actions">
          <button
            onClick={handleProceed}
            className={`btn-proceed ${agreed ? "active" : ""}`}
            disabled={!agreed}
          >
            <span>Proceed</span>
            <span className="cta-motion" aria-hidden="true" />
          </button>
          <button onClick={handleClearData} className="btn-clear-data">
            Clear Local Data
          </button>
        </div>
      </div>
    </div>
  );
}
