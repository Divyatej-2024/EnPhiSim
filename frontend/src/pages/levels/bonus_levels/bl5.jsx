// src/pages/levels/hard/bI5.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI5() {
  return (
    <LevelTemplate
      id="bI5"
      title="Elephant (Bonus)"
      category="hard_bonus"
      content="<p>Long puzzle combining supply-chain + deepfake signals.</p>"
      options={[
        { key: "start", label: "Start Bonus", style: "primary" },
        { key: "skip", label: "Skip", style: "neutral" }
      ]}
      correctOption="start"
      nextPath="/levels/adv_hard/I29"
    />
  );
}
