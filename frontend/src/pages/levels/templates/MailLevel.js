import React,{ useState } from "react";
import { Link } from "react-router-dom";
import "../../../level.css";

// Props: level, onOptionClick, onNextLevel
export default function MailLevel({ level, onOptionClick, onNextLevel }) {
  if (!level) return <div>Level data not found.</div>;

  const {
    level_text,
    page_title,
    phish_email,
    crct_email,
    from_and_to,
    subj,
    category,
    id,
  } = level;

  const subject = subj || "No Subject";

  // Options
  const options = [
    { key: "correct", label: level.correct_option, correct: true, type: "link" },
    { key: "wrong", label: level.wrong_option, correct: false, type: "button" },
    { key: "neutral", label: level.neutral_option, correct: false, type: "button" },
  ].filter(opt => opt.label);

  // Styles
  const container = {
    background: "#f8f8f8",
    maxWidth: "800px",
    margin: "20px auto",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const header = {
    background: "#fff",
    padding: "20px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const profilePhoto = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const emailBody = {
    padding: "20px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
  };

  const optionsContainer = {
    padding: "20px",
    textAlign: "center",
  };

  const buttonBase = {
    margin: "0 10px",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    border: "none",
    transition: "0.2s",
  };

  const correctButton = { ...buttonBase, background: "#4CAF50", color: "#fff" };
  const wrongButton = { ...buttonBase, background: "#f44336", color: "#fff" };
  const neutralButton = { ...buttonBase, background: "#ccc", color: "#333" };

  const backButton = { ...buttonBase, background: "#2196F3", color: "#fff" };

  return (
      <div style={{ textAlign: "center", paddingBottom: "20px" }}>
        <Link to="/dashboard" style={backButton}>
          Back to Dashboard
        </Link>
      </div>
    
    <div style={container}>
      {/* Page Title */}
      <h2 style={{ textAlign: "center", paddingTop: "15px" }}>{page_title}</h2>

      {/* Email Header */}
      <div style={header}>
        {/* Profile / demographic photo */}
        <img
          src="/avtar.png" // Example demographic photo
          alt="Profile"
          style={profilePhoto}
        />
        <div style={{color:"#333"}}>
          <p>
            <strong>From/To:</strong> {from_and_to || "sender@example.com"}
          </p>
          <p>
            <strong>Subject:</strong> {subject}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <span title={crct_email}>{phish_email}</span>
          </p>
        </div>
      </div>

      {/* Email Body */}
      <div style={{color:"#333"}}>{level_text || "This is the email body."}</div>

      {/* Options */}
      <div style={optionsContainer}>
        {options.map(opt => {
          if (opt.type === "link") {
            return (
              <Link
                key={opt.key}
                to={`/levels/${category}/l${id + 1}`}
                style={correctButton}
                onClick={() => onOptionClick(opt)}
              >
                {opt.label}
              </Link>
            );
          } else {
            return (
              <button
                key={opt.key}
                style={opt.key === "wrong" ? wrongButton : neutralButton}
                onClick={() => onOptionClick(opt)}
              >
                {opt.label}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
