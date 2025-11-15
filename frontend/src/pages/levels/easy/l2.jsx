import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level-mail.css";
import "../../../level.css";

/**
 * Auto-generated component for l2 — Scam Invoice/Payment reminder
 * Hint: Phish email, wrong invoce and payment reminder
 * from_to: vendor to the supplier
 */

export default function L_l2() {
  const navigate = useNavigate();
  const { addAction } = useProgress();
  const [selected, setSelected] = useState(null);

  const handleChoice = (key) => {
    setSelected(key);

    // record the action for Dashboard
    addAction({
      level: "l2",
      page_title: "Scam Invoice/Payment reminder",
      choice: key,
      time: new Date().toISOString(),
    });

    // short delay then navigate to the next level
    setTimeout(() => {
      navigate("/levels/easy/l3");
    }, 900);
  };

  return (
    <div className="level-container fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>Scam Invoice/Payment reminder — Phish email, wrong invoce and payment reminder</h1>
      <p className="level-subtitle">Subject: OVERDUE! We haven't received your payment of £1,200. Check the attached invoice and pay immediately to keep your service running! - Accounts Dept.</p>

      <div className="email-wrapper">
        <div className="task-box">
          <h3>Your Task:</h3>
          <p>Phish email, wrong invoce and payment reminder</p>
        </div>

        <div className="email-panel">
          <div className="email-header-actions">
            <button
              className={`phish-btn ${selected === "correct" ? "correct" : ""}`}
              onClick={() => handleChoice("correct")}
            >
              Unsubscribe
            </button>

            <button
              className={`delete-btn ${selected === "neutral" ? "selected" : ""}`}
              onClick={() => handleChoice("neutral")}
            >
              ignore
            </button>
          </div>

          <div className="email-header">
            <strong>From:</strong>{" "}
            <span className="sender-hover">
              vendor to the supplier
              <span className="hover-tooltip">
                ⚠ Suspicious address<br />
                <strong>Correct (example):</strong> it.support@tees.ac.uk
              </span>
            </span>

            <h3 className="email-subject">Scam Invoice/Payment reminder</h3>
          </div>

          <div className="email-content">
            <p>Subject: OVERDUE! We haven't received your payment of £1,200. Check the attached invoice and pay immediately to keep your service running! - Accounts Dept.</p>
          </div>

          <div className="email-footer">
            <button
              className={`verify-btn ${selected === "wrong" ? "wrong" : ""}`}
              onClick={() => handleChoice("wrong")}
            >
              click on the Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
