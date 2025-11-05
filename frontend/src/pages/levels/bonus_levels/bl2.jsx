// src/pages/levels/adv_easy/bI2.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI2() {
  return (
    <LevelTemplate
      id="bI2"
      title="Monkey (Bonus)"
      category="adv_easy_bonus"
      content="<p>Timed mini-challenge: identify 3 suspicious items in 60s (simulated).</p>"
      options={[
        { key: "start", label: "Start Challenge", style: "primary" },
        { key: "skip", label: "Skip", style: "neutral" }
      ]}
      correctOption="start"
      nextPath="/levels/normal/I13"
    />
  );
}
