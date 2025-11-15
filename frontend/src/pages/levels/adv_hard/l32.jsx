// src/pages/levels/adv_hard/I32.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I32() {
  return (
    <LevelTemplate
      id="I32"
      title="Multi-vector adaptive BEC with reconnaissance"
      category="advanced hard"
      content="<p>Adaptive scam combining data across channels to request funds.</p>"
      options={[
        { key: "transfer", label: "Transfer Funds", style: "primary" },
        { key: "verify", label: "Verify via CFO", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/adv_hard/bI6"
    />
  );
}
