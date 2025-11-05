// src/pages/levels/hard/I26.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I26() {
  return (
    <LevelTemplate
      id="I26"
      title="Deepfake-Assisted Voice Whishing"
      category="hard"
      content="<p>Voice call impersonates manager using deepfake audio alongside email.</p>"
      options={[
        { key: "comply", label: "Comply with Request", style: "primary" },
        { key: "verify", label: "Verify via Secure Channel", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/hard/I27"
    />
  );
}
