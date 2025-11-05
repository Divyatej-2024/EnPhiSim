// src/pages/levels/normal/I16.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I16() {
  return (
    <LevelTemplate
      id="I16"
      title="Invoice Impersonation"
      category="normal"
      content="<p>Invoice that mimics your vendor style but changes payment details.</p>"
      options={[
        { key: "pay", label: "Pay", style: "primary" },
        { key: "verify", label: "Verify Invoice", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/normal/I17"
    />
  );
}
