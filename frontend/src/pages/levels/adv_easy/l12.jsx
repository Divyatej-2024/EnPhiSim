// src/pages/levels/adv_easy/I12.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I12() {
  return (
    <LevelTemplate
      id="I12"
      title="Clone of a Public Service Alert"
      category="advanced easy"
      content="<p>Message mimics a government/tax alert asking to verify details online.</p>"
      options={[
        { key: "follow", label: "Follow Link", style: "primary" },
        { key: "call", label: "Call Official Number", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="call"
      nextPath="/levels/normal/I13"
    />
  );
}
