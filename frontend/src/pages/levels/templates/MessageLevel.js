import React from "react";

export default function MessageLevel({ levelData }) {
  return (
    <div style={messageStyle}>
      <h2>{levelData.page_title}</h2>
      <p>{levelData.from_and_to}</p>
      <p>{levelData.level_text || "Simulated message content here."}</p>
    </div>
  );
}

const messageStyle = {
  border: "1px dashed #333",
  padding: "20px",
  maxWidth: "400px",
  margin: "20px auto",
  borderRadius: "6px",
  background: "#fff9e6",
};
