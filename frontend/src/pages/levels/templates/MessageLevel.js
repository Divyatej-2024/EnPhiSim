import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

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
          <div style={{ width: "100%", maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 14, background: "#0f766e", color: "#fff" }}>
              <strong>{level.contact_name || "Contact"}</strong>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{level.status || "Online"}</div>
            </div>

            {level.show_warning && (
              <div style={{ padding: 12, borderBottom: "1px solid #fbbf24", background: "#fffbeb" }}>
                <strong>Warning:</strong> This conversation contains suspicious content.
              </div>
            )}

            <div style={{ padding: 16, minHeight: 320, background: "#f1f5f9" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: 12, textAlign: msg.sender === "user" ? "right" : "left" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 12px",
                      borderRadius: 10,
                      maxWidth: "min(80%, 520px)",
                      background: msg.sender === "user" ? "#dcfce7" : "#fff",
                    }}
                  >
                    {msg.sender !== "user" && <div style={{ fontSize: 12, fontWeight: 600 }}>{msg.sender_name || level.contact_name}</div>}
                    <div style={{ overflowWrap: "anywhere" }}>{msg.text}</div>
                    {msg.has_link && <div style={{ marginTop: 4, fontSize: 12, color: "#b91c1c" }}>Contains external link</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a response..."
                disabled={locked}
                style={{ flex: "1 1 240px", minWidth: 0, padding: 10, borderRadius: 20, border: "1px solid #cbd5e1" }}
              />
              <button disabled={!draft.trim() || locked} onClick={() => setDraft("")}>
                Send
              </button>
            </div>

            <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button disabled={locked} onClick={() => onAction("block", { contact: level.contact_name, reason: "phishing" })}>
                Block Contact
              </button>
              <button disabled={locked} onClick={() => onAction("report", { contact: level.contact_name, messages })}>
                Report Conversation
              </button>
              <button disabled={locked} onClick={() => onAction("safe", { contact: level.contact_name })}>
                Mark Safe
              </button>
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}
