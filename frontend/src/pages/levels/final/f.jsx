import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level-mail.css";
import "../../../level.css";

/**
 * Auto-generated component for f — Advanced Persistent Phishing
 * Hint: Sender is a compromised internal account.
 * from_to: Fake redirection to the user
 */

export default function L_f() {
  const navigate = useNavigate();
  const { addAction } = useProgress();
  const [selected, setSelected] = useState(null);

  const handleChoice = (key) => {
    setSelected(key);

    // record the action for Dashboard
    addAction({
      level: "f",
      page_title: "Advanced Persistent Phishing",
      choice: key,
      time: new Date().toISOString(),
    });

    // short delay then navigate to the next level
    setTimeout(() => {
      navigate("/dashboard");
    }, 900);
  };

  return (
    <div className="level-container fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>Advanced Persistent Phishing — Sender is a compromised internal account.</h1>
      <p className="level-subtitle"></p>

      <div className="email-wrapper">
        <div className="task-box">
          <h3>Your Task:</h3>
          <p>Sender is a compromised internal account.</p>
        </div>

        <div className="email-panel">
          <div className="email-header-actions">
            <button
              className={`phish-btn ${selected === "correct" ? "correct" : ""}`}
              onClick={() => handleChoice("correct")}
            >
              Report Phishing
            </button>

            <button
              className={`delete-btn ${selected === "neutral" ? "selected" : ""}`}
              onClick={() => handleChoice("neutral")}
            >
              Ignore
            </button>
          </div>

          <div className="email-header">
            <strong>From:</strong>{" "}
            <span className="sender-hover">
              Fake redirection to the user
              <span className="hover-tooltip">
                ⚠ Suspicious address<br />
                <strong>Correct (example):</strong> it.support@tees.ac.uk
              </span>
            </span>

            <h3 className="email-subject">Advanced Persistent Phishing</h3>
          </div>

          <div className="email-content">
            <p>You received an email. Evaluate it.</p>
          </div>

          <div className="email-footer">
            <button
              className={`verify-btn ${selected === "wrong" ? "wrong" : ""}`}
              onClick={() => handleChoice("wrong")}
            >
              Click Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
