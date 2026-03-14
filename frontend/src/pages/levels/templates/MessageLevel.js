import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./MessageLevel.css";

export default function MessageLevel({ scenario, onAction, locked }) {
  const [draft, setDraft] = useState("");

  return (
    <BaseLevel levelType="message" scenario={scenario} onAction={onAction}>
      {({ level, onAction, locked }) => {
        // Create message from your data
        const messages = [
          {
            sender: "sender",
            sender_name: level.from_address || level.phish_email || "Unknown",
            text: level.body_text || level.content || "No message content",
            timestamp: new Date().toLocaleTimeString(),
            has_link: level.links && level.links.length > 0,
          }
        ];

        return (
          <div className="message-container">
            <div className="message-header">
              <strong>{level.from_address || level.phish_email || "Message"}</strong>
              <div className="message-status">New Message</div>
            </div>

            {level.show_warning && (
              <div className="message-warning">
                <strong>Warning:</strong> This message contains suspicious content.
              </div>
            )}

            <div className="message-area">
              {messages.map((msg, idx) => (
                <div key={idx} className="message-bubble incoming">
                  <div className="message-content incoming">
                    <div className="message-sender">{msg.sender_name}</div>
                    <div className="message-text">{msg.text}</div>
                    {msg.has_link && (
                      <div className="message-link-warning">
                        <span>⚠️ Contains suspicious link: {level.links?.[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: Show links section */}
            {level.links && level.links.length > 0 && (
              <div className="message-links">
                <strong>Links in message:</strong>
                <ul>
                  {level.links.map((link, idx) => (
                    <li key={idx} className="suspicious-link">{link}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="message-actions">
              {/* Wrong Action Button */}
              <button
                className="message-action-btn block"
                disabled={locked}
                onClick={() => {
                  console.log('❌ Wrong action clicked:', level.wrong_action);
                  onAction(level.wrong_action, { 
                    contact: level.from_address,
                    reason: "phishing" 
                  });
                }}
              >
                {level.wrong_action || "Schedule Delivery"}
              </button>
              
              {/* Neutral Action Button */}
              <button
                className="message-action-btn safe"
                disabled={locked}
                onClick={() => {
                  console.log('⚪ Neutral action clicked:', level.neutral_action);
                  onAction(level.neutral_action, { 
                    contact: level.from_address 
                  });
                }}
              >
                {level.neutral_action || "Investigate"}
              </button>
              
              {/* Correct Action Button */}
              <button
                className="message-action-btn report"
                disabled={locked}
                onClick={() => {
                  console.log('✅ Correct action clicked:', level.correct_action);
                  onAction(level.correct_action, { 
                    contact: level.from_address,
                    messages: messages 
                  });
                }}
              >
                {level.correct_action || "Report Phish"}
              </button>
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}
