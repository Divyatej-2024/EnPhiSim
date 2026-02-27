import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function NotificationLevel({ level: scenario }) {
  const [selected, setSelected] = useState(null);

  return (
    <BaseLevel levelType="notification" scenario={scenario}>
      {({ level, onAction, locked }) => {
        const notifications =
          Array.isArray(level.notifications) && level.notifications.length > 0
            ? level.notifications
            : [
                {
                  id: level.id || "n1",
                  title: level.subj || "Security Notice",
                  message: level.level_text || "A new notification requires your attention.",
                  sender: level.phish_email || "Unknown sender",
                  suspicious: true,
                  time: "Just now",
                },
              ];

        const current = selected != null ? notifications[selected] : null;

        return (
          <div style={{ width: "100%", maxWidth: 850, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 14, background: "#1d4ed8", color: "#fff" }}>
              <strong>Notification Center</strong>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", borderBottom: "1px solid #e5e7eb" }}>
              {notifications.map((n, idx) => (
                <div
                  key={n.id || idx}
                  onClick={() => setSelected(selected === idx ? null : idx)}
                  style={{
                    padding: 12,
                    cursor: "pointer",
                    background: selected === idx ? "#eff6ff" : "#fff",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{n.title}</div>
                  <div style={{ fontSize: 14, color: "#475569" }}>{n.message}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{n.time || "Now"}</div>
                </div>
              ))}
            </div>

            {current && (
              <div style={{ padding: 14, background: "#f8fafc" }}>
                <div><strong>From:</strong> {current.sender || "System"}</div>
                <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{current.full_message || current.message}</div>
                {current.suspicious && (
                  <div style={{ marginTop: 10, color: "#b91c1c" }}>This notification looks suspicious.</div>
                )}

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button disabled={locked} onClick={() => onAction("block", { notification_id: current.id })}>
                    Block Sender
                  </button>
                  <button disabled={locked} onClick={() => onAction("ignore", { notification_id: current.id })}>
                    Ignore
                  </button>
                  <button disabled={locked} onClick={() => onAction("safe", { notification_id: current.id })}>
                    Mark Safe
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </BaseLevel>
  );
}
