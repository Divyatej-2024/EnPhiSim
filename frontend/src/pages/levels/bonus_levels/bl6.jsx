// src/pages/levels/adv_hard/bI6.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI6() {
  return (
    <LevelTemplate
      id="bI6"
      title="HoneyBee (Bonus)"
      category="adv_hard_bonus"
      content="<p>Multi-day investigation simulation (condensed here).</p>"
      options={[
        { key: "start", label: "Start Challenge", style: "primary" },
        { key: "skip", label: "Skip", style: "neutral" }
      ]}
      correctOption="start"
      nextPath="/levels/final/F"
    />
  );
}
