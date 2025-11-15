import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level-mail.css";
import "../../../level.css";

/**
 * Auto-generated component for l16 — invoice impersonation
 * Hint: The invoice is for an unknown service or has new bank details.
 * from_to: pretending to be real invoice to the user
 */

export default function L_l16() {
  const navigate = useNavigate();
  const { addAction } = useProgress();
  const [selected, setSelected] = useState(null);

  const handleChoice = (key) => {
    setSelected(key);

    // record the action for Dashboard
    addAction({
      level: "l16",
      page_title: "invoice impersonation",
      choice: key,
      time: new Date().toISOString(),
    });

    // short delay then navigate to the next level
    setTimeout(() => {
      navigate("/levels/normal/l17");
    }, 900);
  };

  return (
    <div className="level-container fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>invoice impersonation — The invoice is for an unknown service or has new bank details.</h1>
      <p className="level-subtitle"></p>

      <div className="email-wrapper">
        <div className="task-box">
          <h3>Your Task:</h3>
          <p>The invoice is for an unknown service or has new bank details.</p>
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
              pretending to be real invoice to the user
              <span className="hover-tooltip">
                ⚠ Suspicious address<br />
                <strong>Correct (example):</strong> it.support@tees.ac.uk
              </span>
            </span>

            <h3 className="email-subject">invoice impersonation</h3>
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
