// src/pages/levels/normal/I13.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I13() {
  return (
    <LevelTemplate
      id="I13"
      title="Spear-Phishing"
      category="normal"
      content="<p>Personalised email referencing your manager and an urgent request.</p>"
      options={[
        { key: "reply", label: "Reply with Info", style: "primary" },
        { key: "verify", label: "Verify With Manager", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/normal/I14"
    />
  );
}
