import React from "react";
import { Link } from "react-router-dom";
// Note: You must update the parent component (where MailLevel is rendered)
// to pass a function called 'onNextLevel' for redirection.

// ADD onNextLevel to the props
export default function MailLevel({ level, onOptionClick, onNextLevel }) { 
  if (!level) {
    return <div>Level data not found.</div>;
  }

  const {
    from_and_to,
    level_text,
    page_title,
    phish_email,
    crct_email,
  } = level;

  // Choose which subject to display
  const subject = phish_email || crct_email || "No Subject";

  // Prepare options safely (no mutations)
  const options = [
    { key: "correct", label: level.correct_option, correct: true, type: "Link" },
    { key: "wrong", label: level.wrong_option, correct: false, type: "Button" },
    { key: "neutral", label: level.neutral_option, correct: false, type: "Button" },
  ].filter(opt => opt.label);

  // --- Styles for the Mail Interface ---
  const mailContainerStyle = {
    background: "#f8f8f8",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    minHeight: "500px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const emailWindowStyle = {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const headerStyle = {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
  };

  const subjectStyle = {
    fontSize: "1.5em",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    color: "#333",
  };

  const metaStyle = {
    fontSize: "0.9em",
    color: "#666",
    marginBottom: "5px",
  };

  const emailBodyStyle = {
    padding: "20px",
    color:"#333",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  };

  const buttonAreaStyle = {
    padding: "20px",
    borderTop: "1px solid #eee",
    textAlign: "center",
  };

  const buttonBaseStyle = {
    margin: "0 10px",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    border: "1px solid transparent",
    transition: "background-color 0.2s, border-color 0.2s",
  };

  // REVISED: Make the correct option look like a clear success button
  const correctButtonStyle = {
    ...buttonBaseStyle,
    background: "#4CAF50", // Green for Correct
    color: "white",
    textDecoration: "none",
  };

  const neutralButtonStyle = {
    ...buttonBaseStyle,
    background: "#f0f0f0", // Light gray
    color: "#333",
    border: "1px solid #ccc",
    textDecoration: "none",
  };

  const wrongButtonStyle = {
    ...buttonBaseStyle,
    background: "#f44336", // Red for Wrong
    color: "white",
    textDecoration: "none",
  };

  // --- Component Structure ---
  return (
    <div style={mailContainerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        {page_title || "Phishing Simulation Level"}
      </h2>

      <div style={emailWindowStyle}>
        {/* Email Header Area */}
        <div style={headerStyle}>
          <h3 style={subjectStyle}>{subject}</h3>
          <p style={metaStyle}>
            <strong>To/From:</strong> {from_and_to || "Sender <sender@example.com>"}
          </p>
        </div>

        {/* Email Body Area */}
        <div style={emailBodyStyle}>
          <p>{level_text || "This is the body of the simulated email."}</p>
        </div>

        {/* Options/Action Buttons Area */}
        <div style={buttonAreaStyle}>
          {options.map((opt) => {
            
            const style = 
                opt.key === "correct" 
                    ? correctButtonStyle 
                    : opt.key === "wrong"
                        ? wrongButtonStyle
                        : neutralButtonStyle;
            
            const Component = opt.type === "Link" ? Link : 'button';

            // Define the click handler logic
            const handleClick = () => {
                // 1. Track the user's progress/action
                onOptionClick(opt); 
                
                // 2. If it's the correct option AND onNextLevel is provided, trigger redirection
                if (opt.key === 'correct' && onNextLevel) {
                    onNextLevel();
                }
            };


            return (
              <Component
                key={opt.key}
                // Use the custom handleClick function
                onClick={handleClick} 
                style={style}
                // Only for <Link> components, ensure they act like buttons
                to={opt.type === "Link" ? "#" : undefined}
              >
                {opt.label || "Action"}
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
}