// src/pages/levels/normal/I14.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I14() {
  return (
    <LevelTemplate
      id="I14"
      title="Business Email Compromise"
      category="normal"
      content="<p>Urgent payment request that appears to be from a senior exec.</p>"
      options={[
        { key: "pay", label: "Initiate Payment", style: "primary" },
        { key: "verify", label: "Verify With Exec", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/normal/I15"
    />
  );
}
