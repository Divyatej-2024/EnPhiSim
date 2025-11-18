import React from "react";

export default function ImageLevel({ levelData }) {
  return (
    <div style={imageStyle}>
      <h2>{levelData.page_title}</h2>
      <img src={levelData.from_and_to || "https://via.placeholder.com/300"} alt={levelData.page_title} style={{ maxWidth: "100%" }} />
    </div>
  );
}

const imageStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  maxWidth: "400px",
  margin: "20px auto",
  borderRadius: "8px",
  textAlign: "center",
};
