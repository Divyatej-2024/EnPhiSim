// src/pages/levels/pre_hard/I21.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I21() {
  return (
    <LevelTemplate
      id="I21"
      title="QR Code Quishing"
      category="prehard"
      content="<p>Email contains a QR code that points to a fake login site. Preview before scanning.</p>"
      options={[
        { key: "scan", label: "Scan QR", style: "primary" },
        { key: "preview", label: "Preview URL", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="preview"
      nextPath="/levels/pre_hard/I22"
    />
  );
}
