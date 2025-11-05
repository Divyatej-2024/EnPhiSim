// src/pages/levels/hard/I25.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I25() {
  return (
    <LevelTemplate
      id="I25"
      title="Compromised Internal Account Spear-Phish"
      category="hard"
      content="<p>Email appears internal, but headers show unusual external relay. Inspect headers.</p>"
      options={[
        { key: "trust", label: "Trust", style: "primary" },
        { key: "verify", label: "Verify Headers", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/hard/I26"
    />
  );
}
