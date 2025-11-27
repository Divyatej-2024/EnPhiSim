import React from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function MailLevel({ level, onOptionClick, onNextLevel }) {
  // 1. HOOKS MUST BE AT TOP (never inside conditions)
  const navigate = useNavigate();
  const { progress } = useProgress();

  // 2. VALIDATE LEVEL DATA AT THE START
  if (!level) {
    return <div>Error: Level data is missing.</div>;
  }

  const {
    level_text,
    page_title,
    phish_email,
    crct_email,
    from_and_to,
    subject,
    options
  } = level;

  // 3. SAFE OPTIONAL ACCESS
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="mail-level">
      <h1>{page_title || "Email Level"}</h1>

      <p className="level-text">{level_text}</p>

      <div className="email-box">
        <p><strong>From / To:</strong> {from_and_to || "Unknown"}</p>
        <p><strong>Subject:</strong> {subject || "No subject"}</p>

        <div className="email-content">
          {(phish_email || crct_email || "No email content provided.")}
        </div>
      </div>

      <div className="options">
        {safeOptions.length > 0 ? (
          safeOptions.map((opt, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => onOptionClick(opt, level.id)}
            >
              {opt.label}
            </button>
          ))
        ) : (
          <p>No options available for this level.</p>
        )}
      </div>

      <button className="next-btn" onClick={onNextLevel}>
        Next Level
      </button>
    </div>
  );
}
