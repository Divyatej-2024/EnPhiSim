// src/pages/levels/adv_easy/I9.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I9() {
  return (
    <LevelTemplate
      id="I9"
      title="Malicious Survey / Feedback Request"
      category="advanced easy"
      content="<p>Click this quick survey to claim a discount.</p>"
      options={[
        { key: "take", label: "Take Survey", style: "primary" },
        { key: "report", label: "Report", style: "neutral" },
        { key: "ignore", label: "Ignore", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/adv_easy/I10"
    />
  );
}
