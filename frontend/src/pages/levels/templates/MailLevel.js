import React from "react";

export default function MailLevel({ level, onOptionClick }) {
 if (!level) {
    return <div>Level data not found.</div>;
}
const { from_and_to, level_text, page_title } = level;

const options = [
  { key: "correct", label: level.correct_option, correct: true },
  { key: "neutral", label: level.neutral_option, correct: false },
  { key: "wrong", label: level.wrong_option, correct: false },
];
level.options = options;


  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>{page_title || "No title"}</h2>
      <p>{from_and_to}</p>
      <p>{phish_email}</p>
      <p>{crct_email}</p>
      <p>{level_text}</p>
<div style={{ marginTop: "15px" }}>
        {level.options?.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{ marginRight: "10px", padding: "8px 12px", cursor: "pointer" }}
          >
            {opt.label || "Option"}
          </button>
        ))}
      </div>
    </div>
  );
}
