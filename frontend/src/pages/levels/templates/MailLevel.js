import React,{ useState } from "react";
import { Link } from "react-router-dom";
import "../../../level.css";



export default function MailLevel({ level, onOptionClick, onNextLevel }) {

  const [showCorrect, setShowCorrect] = React.useState(false);
  
  if (!level) {
    return <div>Level data not found.</div>;
  }

  
  
  const { from_and_to, level_text, page_title, phish_email, crct_email } = level;

  const subject = phish_email || crct_email || "No Subject";

  const options = [
    { key: "correct", label: level.correct_option, correct: true },
    { key: "wrong", label: level.wrong_option, correct: false },
    { key: "neutral", label: level.neutral_option, correct: false },
  ].filter(opt => opt.label);


  const linkStyle = {
    display: "inline-block",
    margin: "0 10px",
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "600",
  };

  const wrongButtonStyle = {
    margin: "0 10px",
    padding: "10px 20px",
    background: "#f44336",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  const neutralButtonStyle = {
    margin: "0 10px",
    padding: "10px 20px",
    background: "#f0f0f0",
    color: "#333",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid #ccc",
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>{page_title}</h2>

      <div style={{ background: "#fff", border: "1px solid #ccc",color:"#333", padding: 20 }}>
        <h3>{subject}</h3>

        <p>
  <strong>Email: </strong>

  <span
    onMouseEnter={() => setShowCorrect(true)}
    onMouseLeave={() => setShowCorrect(false)}
    style={{ 
      background: showCorrect ? "#e6ffe6" : "transparent",
      padding: "2px 4px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "0.2s",
      fontWeight: showCorrect ? "bold" : "normal"
    }}
    title="Hover to see the legitimate sender"
  >
    {showCorrect ? crct_email : phish_email}
  </span>
</p>


        <p>{level_text}</p>

        <div style={{ marginTop: 20, textAlign: "center" }}>

          {options.map((opt) => {
            if (opt.key === "correct") {
              // ONLY CORRECT OPTION → LINK
              return (
                <Link
                  key={opt.key}
                  to={`/levels/${level.category}/${level.id + 1}`}
                  style={linkStyle}
                  onClick={() => onOptionClick(opt)}
                >
                  {opt.label}
                </Link>
              );
            }

            // WRONG + NEUTRAL → BUTTONS
            const style =
              opt.key === "wrong" ? wrongButtonStyle : neutralButtonStyle;

            return (
              <button
                key={opt.key}
                onClick={() => onOptionClick(opt)}
                style={style}
              >
                {opt.label}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
