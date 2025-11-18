import React from "react";

export default function MailLevel({ level, onOptionClick }) {
  if (!level) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          padding: "20px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          color: "red",
        }}
      >
        Level data not found.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <strong style={{ display: "block", fontSize: "18px", color: "#222" }}>
            {level.from_and_to || "IT Support"}
          </strong>
          <span style={{ fontSize: "14px", color: "gray" }}>
            {level.email || "it-support@university.ac.uk"}
          </span>
        </div>
        <div style={{ fontSize: "14px", color: "#555" }}>{level.date || "Today"}</div>
      </div>

      {/* SUBJECT */}
      <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
        {level.page_title || "No Title"}
      </div>

      {/* EMAIL BODY */}
      <div style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "25px" }}>
        {level.level_text || level.content || "No content available."}
      </div>

      {/* OPTIONS */}
      {level.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {level.options.map((opt) => (
            <button
              key={opt.key}
              onMouseOver={(e) => (e.target.style.background = "#155ec4")}
              onMouseOut={(e) => (e.target.style.background = "#1a73e8")}
              onClick={() => onOptionClick(opt)}
              style={{
                padding: "12px 20px",
                background: "#1a73e8",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "0.2s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
