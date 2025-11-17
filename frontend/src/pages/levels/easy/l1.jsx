import React from "react";
import "../../../level.css";
import "../../../level-mail.css";
import "./l1.css";

export default function Level1({ level, onOptionClick }) {
  return (
    <div className="level-mail-wrapper">
      <div className="mail-header">
        <div className="mail-from">
          <strong>{level.from || "IT Support"}</strong>
          <span>{level.email || "it-support@university.ac.uk"}</span>
        </div>
        <div className="mail-meta">
          <span>{level.date || "Today"}</span>
        </div>
      </div>

      <div className="mail-subject">
        {level.page_title}
      </div>

      <div
        className="mail-body"
        dangerouslySetInnerHTML={{ __html: level.content }}
      />

      <div className="options">
        {level.options?.map((opt) => (
          <button key={opt.key} onClick={() => onOptionClick(opt)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
