import React from "react";

export default function BrowserLevel({ levelData }) {
  return (
    <div style={browserStyle}>
      <h2>{levelData.page_title}</h2>
      <p><strong>URL/Source:</strong> {levelData.from_and_to}</p>
      <p>{levelData.level_text || "Simulated browser content goes here."}</p>
    </div>
  );
}

const browserStyle = {
  border: "2px solid #666",
  padding: "20px",
  maxWidth: "700px",
  margin: "auto",
  borderRadius: "6px",
  background: "#f8f8f8",
};
