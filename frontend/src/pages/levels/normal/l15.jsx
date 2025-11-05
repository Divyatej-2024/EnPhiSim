// src/pages/levels/normal/I15.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I15() {
  return (
    <LevelTemplate
      id="I15"
      title="Drive / Share Notification"
      category="normal"
      content="<p>Shared drive link requests login to view document.</p>"
      options={[
        { key: "login", label: "Login to View", style: "primary" },
        { key: "open", label: "Open Without Login", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/normal/I16"
    />
  );
}
