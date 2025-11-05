// src/pages/levels/easy/I1.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I1() {
  return (
    <LevelTemplate
      id="l1"
      title="Master Credential-Phish"
      category="easy"
      content="<p><strong>Hello User,</strong></p><p>Your account verification has timed out. Please click below to re-verify your account immediately to avoid suspension.</p>"
      options={[
        { key: "verify", label: "Verify Now", style: "primary" },
        { key: "remind", label: "Remind Me Later", style: "neutral" },
        { key: "unsubscribe", label: "Unsubscribe", style: "neutral" }
      ]}
      correctOption="unsubscribe"
      nextPath="/levels/easy/l2"
    />
  );
}
