// src/pages/levels/hard/I28.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I28() {
  return (
    <LevelTemplate
      id="I28"
      title="Targeted Supply-Chain Phishing"
      category="hard"
      content="<p>Compromise originates via vendor update email. Verify vendor signatures.</p>"
      options={[
        { key: "install", label: "Install Update", style: "primary" },
        { key: "verify", label: "Verify with Vendor", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/hard/bI5"
    />
  );
}
