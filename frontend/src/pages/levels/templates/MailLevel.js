import React from "react";
import { useProgress } from "../../../context/ProgressContext"; // Keeping this, though currently unused in this component
import "../../../level.css";

// Removed useNavigate hook, and removed onNextLevel prop
export default function MailLevel({ level, onOptionClick }) { 
  // 1. HOOKS MUST BE AT TOP (never inside conditions)
  const { progress } = useProgress(); // Keep useProgress, potentially useful later

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

  // 4. Define the action for the Unsubscribe link
    const unsubscribeAction = {
        label: "Unsubscribe",
        // Setting correct: false for unsubscribing from a malicious email is a common failure
        // However, if your simulation counts 'Unsubscribe' as a safe exit, change this to true.
        correct: true, 
        action: "unsubscribe"
    };

  return (
    <div className="mail-level">
      <h1>{page_title || "Email Level"}</h1>

      <p className="level-text">{level_text}</p>

      <div className="email-box">
        <p className="email-header">
            <span className="email-from">
                <strong>From:</strong> {from_and_to || "Unknown"}
            </span>
            <span className="email-subject">
                <strong>Subject:</strong> {subject || "No subject"}
            </span>
        </p>
        <div className="email-content">
          {(phish_email || crct_email || "No email content provided.")}
        </div>
      </div>

      <div className="options">
        {safeOptions.length > 0 ? (
          safeOptions.map((opt, index) => (
            <button
              key={index}
              // Use the isPrimary class for styling the main action button
              className={`option-btn ${opt.isPrimary ? 'primary-action-btn' : ''}`}
              onClick={() => onOptionClick(opt, level.id)}
            >
              {opt.label}
            </button>
          ))
        ) : (
          <p>No options available for this level.</p>
        )}
        
        {/* --- UNSUBSCRIBE LINK takes the place of the Next Level button --- */}
        <button
            className="unsubscribe-link"
            // Call onOptionClick with the predefined unsubscribe action
            onClick={() => onOptionClick(unsubscribeAction, level.id)}
        >
            Unsubscribe from these alerts
        </button>
        {/* ------------------------------------------------------------------ */}
      </div>
        
        {/* REMOVED: The static "Next Level" button */}
    </div>
  );
}
