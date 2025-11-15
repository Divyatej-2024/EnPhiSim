// src/pages/levels/pre_hard/bI4.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI4() {
  return (
    <LevelTemplate
      id="bI4"
      title="Shark (Bonus)"
      category="prehard_bonus"
      content="<p>Bonus: mixed vector (QR + voice + email). Test your synthesis skills.</p>"
      options={[
        { key: "start", label: "Start Bonus", style: "primary" },
        { key: "skip", label: "Skip", style: "neutral" }
      ]}
      correctOption="start"
      nextPath="/levels/hard/I24"
    />
  );
}
