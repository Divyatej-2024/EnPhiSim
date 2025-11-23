import React from "react";

export default function MailLevel({ level, onOptionClick }) {
 if (!level) {
    return <div>Level data not found.</div>;
}
const { from_and_to, level_text, page_title, phish_email, crct_email } = level;

const option_crct = [
  { key: "correct", label: level.correct_option, correct: true }];

const option_neu =[  { key: "neutral", label: level.neutral_option, correct: false }
];
const option_error = [  { key: "wrong", label: level.wrong_option, correct: false }
];
level.option_cr = option_crct;
level.option_neut = option_neu;
level.option_wron = option_error;


  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>{page_title || "No title"}</h2>
      <div style={{ marginTop: "15px" }}>
        {level.option_neut?.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{ marginRight: "10px", padding: "8px 12px", cursor: "pointer" }}
          >
            {opt.label || "Option"}
          </button>
        ))}
      </div>

      <p>{from_and_to}</p>
      <p>{phish_email}</p>
      <p>{crct_email}</p>
      <p>{level_text}</p>
<div style={{ marginTop: "15px" }}>
        {level.option_wron?.map((opt) => (
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
