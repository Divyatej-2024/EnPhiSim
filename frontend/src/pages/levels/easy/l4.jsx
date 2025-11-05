// src/pages/levels/easy/I4.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I4() {
  return (
    <LevelTemplate
      id="I4"
      title="Lottery / Prize Scam"
      category="easy"
      content="<p>Congratulations! You have won a prize. Provide bank details to claim.</p>"
      options={[
        { key: "claim", label: "Claim Prize", style: "primary" },
        { key: "report", label: "Report", style: "neutral" },
        { key: "delete", label: "Delete", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/I5"
    />
  );
}
