import React from "react";
import { Link } from "react-router-dom";

export default function MailLevel({ level, onOptionClick }) {
  if (!level) {
    return <div>Level data not found.</div>;
  }

  const { from_and_to, level_text, page_title, phish_email, crct_email } = level;

  // Prepare options safely (no mutations)
  const option_neut = [
    { key: "neutral", label: level.neutral_option, correct: false }
  ];

  const option_error = [
    { key: "wrong", label: level.wrong_option, correct: false }
  ];

  const option_crct = [
    { key: "correct", label: level.correct_option, correct: true }
  ];

  return (
    <div
      style={{
        background: "#fff",
        color: "black",
        border: "1px solid #ccc",
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <h2>{page_title || "No title"}</h2>

      {/* Neutral Option */}
      <div style={{ marginTop: "15px" }}>
        {option_neut.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {opt.label || "Option"}
          </button>
        ))}
      </div>

      {/* Email area */}
      <div
        style={{
          background: "#333",
          color: "white",
          padding: "15px",
          marginTop: "20px",
          borderRadius: "5px",
        }}
      >
        <p>{from_and_to}</p>
        <p>{phish_email}</p>
        <p>{crct_email}</p>
      </div>

      <p style={{ marginTop: "15px" }}>{level_text}</p>

      {/* Wrong Options */}
      <div style={{ marginTop: "15px" }}>
        {option_error.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {opt.label || "Option"}
          </button>
        ))}
      </div>

      {/* Correct Option */}
      <div style={{ marginTop: "15px" }}>
        {option_crct.map((opt) => (
          <Link
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{
              display: "inline-block",
              marginRight: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              background: "#4caf50",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            {opt.label || "Option"}
          </Link>
        ))}
      </div>
    </div>
  );
}
