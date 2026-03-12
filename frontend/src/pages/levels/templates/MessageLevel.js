import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./MessageLevel.css";

export default function MessageLevel({ level: scenario }) {
  const [draft, setDraft] = useState("");

  return (
    <BaseLevel levelType="message" scenario={scenario}>
      {({ level, onAction, locked }) => {
        const messages =
          Array.isArray(level.messages) && level.messages.length > 0
            ? level.messages
            : [
                {
                  sender: "contact",
                  sender_name: level.contact_name || "Unknown contact",
                  text: level.level_text || "Please check this link immediately.",
                  timestamp: "10:30 AM",
                  has_link: true,
                },
              ];

        return (
          <div className="message-container">
            <div className="message-header">
              <strong>{level.contact_name || "Contact"}</strong>
              <div className="message-status">{level.status || "Online"}</div>
            </div>

            {level.show_warning && (
              <div className="message-warning">
                <strong>Warning:</strong> This conversation contains suspicious content.
              </div>
            )}

            <div className="message-area">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message-bubble ${msg.sender === "user" ? "outgoing" : "incoming"}`}
                >
                  <div className={`message-content ${msg.sender === "user" ? "outgoing" : "incoming"}`}>
                    {msg.sender !== "user" && (
                      <div className="message-sender">{msg.sender_name || level.contact_name}</div>
                    )}
                    <div className="message-text">{msg.text}</div>
                    {msg.has_link && (
                      <div className="message-link-warning">
                        <span className="message-link-indicator" aria-hidden="true" />
                        <span>Contains external link</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="message-input-area">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a response..."
                disabled={locked}
                className="message-input"
              />
              <button
                className="message-send-btn"
                disabled={!draft.trim() || locked}
                onClick={() => setDraft("")}
              >
                Send
              </button>
            </div>

            <div className="message-actions">
              <button
                className="message-action-btn block"
                disabled={locked}
                onClick={() => onAction("block", { contact: level.contact_name, reason: "phishing" })}
              >
                Block Contact
              </button>
              <button
                className="message-action-btn report"
                disabled={locked}
                onClick={() => onAction("report", { contact: level.contact_name, messages })}
              >
                Report Conversation
              </button>
              <button
                className="message-action-btn safe"
                disabled={locked}
                onClick={() => onAction("safe", { contact: level.contact_name })}
              >
                Mark Safe
              </button>
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}
