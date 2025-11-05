// src/pages/levels/easy/bI1.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI1() {
  return (
    <LevelTemplate
      id="bI1"
      title="Eagle (Bonus)"
      category="easy_bonus"
      content="<p>Bonus: quick mixed challenge — flag obvious indicators.</p>"
      options={[
        { key: "flag", label: "Flag Suspicious Items", style: "neutral" },
        { key: "skip", label: "Skip Bonus", style: "primary" }
      ]}
      correctOption="flag"
      nextPath="/levels/adv_easy/I7"
    />
  );
}
