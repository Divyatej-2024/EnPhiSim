// src/pages/levels/hard/I27.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I27() {
  return (
    <LevelTemplate
      id="I27"
      title="Man-in-the-Middle Credential Capture"
      category="hard"
      content="<p>Transparent proxy page captures credentials before relaying to the real site.</p>"
      options={[
        { key: "login", label: "Login", style: "primary" },
        { key: "inspect", label: "Inspect TLS/URL", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="inspect"
      nextPath="/levels/hard/I28"
    />
  );
}
