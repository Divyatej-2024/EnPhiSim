import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level-mail.css";
import "../../../level.css";

/**
 * Auto-generated component for l1 — Mass Credential-Phish
 * Hint: Phish email
 * from_to: Security/IT-Support team mail to the reciever
 */

export default function L_l1() {
  const navigate = useNavigate();
  const { addAction } = useProgress();
  const [selected, setSelected] = useState(null);

  const handleChoice = (key) => {
    setSelected(key);

    // record the action for Dashboard
    addAction({
      level: "l1",
      page_title: "Mass Credential-Phish",
      choice: key,
      time: new Date().toISOString(),
    });

    // short delay then navigate to the next level
    setTimeout(() => {
      navigate("/levels/easy/l2");
    }, 900);
  };

  return (
    <div className="level-container fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>Mass Credential-Phish — Phish email</h1>
      <p className="level-subtitle">Subject: Quick heads-up! Your account password is set to expire today. Please click this link right away to confirm your details and avoid losing access. - Your Friendly IT Team</p>

      <div className="email-wrapper">
        <div className="task-box">
          <h3>Your Task:</h3>
          <p>Phish email</p>
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
              Security/IT-Support team mail to the reciever
              <span className="hover-tooltip">
                ⚠ Suspicious address<br />
                <strong>Correct (example):</strong> it.support@tees.ac.uk
              </span>
            </span>

            <h3 className="email-subject">Mass Credential-Phish</h3>
          </div>

          <div className="email-content">
            <p>Subject: Quick heads-up! Your account password is set to expire today. Please click this link right away to confirm your details and avoid losing access. - Your Friendly IT Team</p>
          </div>

          <div className="email-footer">
            <button
              className={`verify-btn ${selected === "wrong" ? "wrong" : ""}`}
              onClick={() => handleChoice("wrong")}
            >
              verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
