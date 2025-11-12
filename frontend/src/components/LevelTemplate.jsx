import React from "react";
import "../level.css";
//import "../level-mail.css"; // your CSS file above

export default function LevelTemplate({ levelData }) {
  const { sender, subject, body, hints, options } = levelData;

  return (
    <div className="ipad-level-wrapper">
      <div className="ipad-level-container">
        {/* HEADER */}
        <div className="ipad-level-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={sender.avatar}
              alt="avatar"
              className="ipad-avatar"
            />
            <div>
              <div className="ipad-level-title">{sender.name}</div>
              <div className="ipad-level-sub">{subject}</div>
            </div>
          </div>
          <div className="ipad-timer"> 02:00</div>
        </div>

        {/* BODY */}
        <div className="ipad-level-body">{body}</div>

        {/* ACTION BUTTONS */}
        <div className="ipad-actions">
          {options.map((opt, i) => (
            <button
              key={i}
              className={`lt-btn ${opt.type}`}
              onClick={opt.onClick}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* HINTS */}
        {hints && (
          <div className="ipad-hints">
            <div className="hint-title">Hint</div>
            <div className="hidden-hint">{hints.text}</div>
          </div>
        )}

        {/* FOOTER */}
        <div className="ipad-footer">
          <div className="ipad-footer-text">Simulated scenario for training only</div>
          <div className="ipad-footer-buttons">
            <button className="lt-btn neutral">Replay</button>
            <button className="lt-btn positive">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
