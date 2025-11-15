// src/pages/levels/pre_hard/I20.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I20() {
  return (
    <LevelTemplate
      id="I20"
      title="Spear + Whishing Combo"
      category="prehard"
      content="<p>Voice + email attempt combined to elicit immediate credential disclosure.</p>"
      options={[
        { key: "comply", label: "Comply", style: "primary" },
        { key: "verify", label: "Verify Identity", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/pre_hard/I21"
    />
  );
}
