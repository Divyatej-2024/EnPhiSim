// src/pages/levels/adv_hard/I31.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I31() {
  return (
    <LevelTemplate
      id="I31"
      title="Credential Replay + Slow Drip Exfiltration"
      category="advanced hard"
      content="<p>Credentials are replayed to a shadow account over time.</p>"
      options={[
        { key: "revoke", label: "Revoke Sessions", style: "primary" },
        { key: "ignore", label: "Ignore", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="revoke"
      nextPath="/levels/adv_hard/I32"
    />
  );
}
