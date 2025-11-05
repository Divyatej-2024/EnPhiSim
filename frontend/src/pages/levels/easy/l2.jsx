// src/pages/levels/easy/I2.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I2() {
  return (
    <LevelTemplate
      id="l2"
      title="Scam Invoice / Payment Reminder"
      category="easy"
      content="<p>Dear User, your pending invoice of £259.99 is due. Click below to process immediately.</p>"
      options={[
        { key: "pay", label: "Pay Now", style: "primary" },
        { key: "report", label: "Report as Scam", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/l3"
    />
  );
}
