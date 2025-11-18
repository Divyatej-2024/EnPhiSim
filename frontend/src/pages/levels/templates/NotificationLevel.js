import React from "react";

export default function NotificationLevel({ levelData }) {
  return (
    <div style={notificationStyle}>
      <strong>{levelData.page_title}</strong>
      <p>{levelData.from_and_to}</p>
      <p>{levelData.level_text || "Simulated notification content."}</p>
    </div>
  );
}

const notificationStyle = {
  border: "1px solid #888",
  padding: "15px",
  maxWidth: "350px",
  margin: "20px auto",
  borderRadius: "8px",
  background: "#e6f7ff",
};
