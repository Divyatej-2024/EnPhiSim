// src/pages/levels/easy/I1.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";
export const l1 = {
  id: "l1",
  title: "Master Credential-Phish (Real-time)",
  category: "easy",
  contentHtml: `
    <p><strong>Hello User,</strong></p>
    <p>Your account verification has timed out. Click the button below to re-verify now.</p>
    <p style="margin-top:12px"><em>Note: If you do not re-verify in time, your account will be suspended.</em></p>
  `,
  contentPlain: "Your account verification has timed out. Click to re-verify now.",
  events: [
    { t: 0, type: "arrive_email", data: {} },
    { t: 8, type: "followup", data: { text: "Reminder: action required in 30s", unlockHint: "Check for domain typos" } },
    { t: 12, type: "activate_link", data: { key: "phish_link", duration: 18 } }, // link active 18s from t=12..30
    { t: 22, type: "ml_check", data: {} }, // ask ML for a verdict at t=22
    { t: 32, type: "escalation", data: {} }
  ],
  actions: [
    { id: "verify", label: "Verify Now", linkKey: "phish_link" }, // only clickable when phish_link active
    { id: "remind", label: "Remind Me Later", style: "neutral" },
    { id: "unsubscribe", label: "Unsubscribe", style: "neutral" }
  ],
  correctAction: "unsubscribe",
  successMessage: "This was a phishing email. Well done — proceed to the next level.",
  nextLevel: "/levels/easy/l2",
  points: 10,
  mlCheck: { enabled: true, endpoint: "/api/predict" },
  hints: [
    "Sender domain mismatches official address.",
    "Links are only active for a short window — check URL before clicking.",
    "Urgency pressure is frequently used in phishing."
  ]
};

export default function l1Page() {
  // LevelTemplate may expect props differently in your app. 
  // Common pattern: <LevelTemplate level={I1} />
  return <LevelTemplate level={l1} />;
}