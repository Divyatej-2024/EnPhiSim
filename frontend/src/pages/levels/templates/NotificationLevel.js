
// frontend/src/pages/levels/templates/NotificationLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./NotificationLevel.css"; 
import ".Template.css";

export default function NotificationLevel({ level: scenario }) {
  const [selected, setSelected] = useState(null);

  return (
    <BaseLevel levelType="notification" scenario={scenario}>
      {({ level, onAction, locked, now }) => {
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
          <div className="notification-container">
            <div className="notification-header">
              <strong>Notification Center</strong>
              <div className="live-row">
                <span className="live-dot" aria-hidden="true" />
                <span>Live</span>
                <span className="live-time">
                  {(now || new Date()).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="notification-list">
              {notifications.map((n, idx) => (
                <div
                  key={n.id || idx}
                  className={`notification-item ${selected === idx ? "selected" : ""}`}
                  onClick={() => setSelected(selected === idx ? null : idx)}
                >
                  <div className="notification-title">{n.title}</div>
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-time">{n.time || "Now"}</div>
                </div>
              ))}
            </div>

            {current && (
              <div className="notification-detail">
                <p><strong>From:</strong> {current.sender || "System"}</p>
                <p>{current.full_message || current.message}</p>
                
                {current.suspicious && (
                  <div className="notification-suspicious">
                    This notification looks suspicious.
                  </div>
                )}

                <div className="notification-actions">
                  <button
                    className="notification-btn block"
                    disabled={locked}
                    onClick={() => onAction("block", { notification_id: current.id })}
                  >
                    Block Sender
                  </button>
                  <button
                    className="notification-btn ignore"
                    disabled={locked}
                    onClick={() => onAction("ignore", { notification_id: current.id })}
                  >
                    Ignore
                  </button>
                  <button
                    className="notification-btn safe"
                    disabled={locked}
                    onClick={() => onAction("safe", { notification_id: current.id })}
                  >
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
