import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LevelPage() {
  const navigate = useNavigate();

  const levels = [
    {
      id: 1,
      title: "Level 1: Email Phishing",
      description:
        "Identify whether this email is legitimate or a phishing attempt.",
      question: "The email says your bank account will be closed unless you click a link. What should you do?",
      options: [
        "Click the link and verify your details immediately.",
        "Ignore the email and delete it.",
        "Forward it to your friends to check if they got it too.",
      ],
      correct: 1,
    },
    {
      id: 2,
      title: "Level 2: Fake Login Page",
      description:
        "You receive a link to a login page that looks similar to your company portal.",
      question: "The URL is http://company-secure-login.com. What should you do?",
      options: [
        "Check for HTTPS and the official domain name before logging in.",
        "Proceed to login anyway — it looks real.",
        "Share the link to get confirmation from others.",
      ],
      correct: 0,
    },
    {
      id: 3,
      title: "Level 3: Suspicious Attachment",
      description:
        "You receive an attachment claiming to be an invoice from an unknown sender.",
      question: "What’s the safest action?",
      options: [
        "Open the attachment to see what it contains.",
        "Scan it with antivirus software before opening.",
        "Reply asking for more details.",
      ],
      correct: 1,
    },
  ];

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    const current = levels[currentLevel];
    if (selected === current.correct) {
      setScore(score + 1);
    }
    if (currentLevel + 1 < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentLevel(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
      }}
    >
      {!showResult ? (
        <div>
          <h1 style={{ color: "#38bdf8", marginBottom: "1rem" }}>
            {levels[currentLevel].title}
          </h1>
          <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
            {levels[currentLevel].description}
          </p>
          <h3>{levels[currentLevel].question}</h3>

          <div style={{ marginTop: "1.5rem" }}>
            {levels[currentLevel].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  display: "block",
                  margin: "0.8rem auto",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  background:
                    selected === i ? "#38bdf8" : "rgba(255,255,255,0.1)",
                  color: selected === i ? "#0f172a" : "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.3s",
                  width: "60%",
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            style={{
              marginTop: "2rem",
              background: "#38bdf8",
              color: "#0f172a",
              padding: "0.8rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              opacity: selected === null ? 0.6 : 1,
            }}
          >
            {currentLevel + 1 === levels.length ? "Finish" : "Next Level"}
          </button>
        </div>
      ) : (
        <div>
          <h1 style={{ color: "#38bdf8" }}>Training Complete!</h1>
          <p style={{ margin: "1rem 0", fontSize: "1.2rem" }}>
            You scored <strong>{score}</strong> out of {levels.length}.
          </p>

          <button
            onClick={restart}
            style={{
              background: "#38bdf8",
              color: "#0f172a",
              padding: "0.8rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              marginRight: "1rem",
            }}
          >
            Restart Training
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              background: "#0ea5e9",
              color: "#0f172a",
              padding: "0.8rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
}

export default LevelPage;
