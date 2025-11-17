import React from "react";
import "../../level.css";
import "../../level-mail.css";
import ".levels/l1.css";
export default function Level1({ level, onOptionClick }) {
  return (
    <div className="level-container">
      <h1>{level.page_title}</h1>

      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: level.content }}
      />

      <div className="options">
        {level.options.map((opt) => (
          <button key={opt.key} onClick={() => onOptionClick(opt)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
