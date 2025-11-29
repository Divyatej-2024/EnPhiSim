import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { levels } from "../../levels/level_data"; 
import "../../../level.css";

export default function MailLevelPage() {
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const level = levels[currentIndex];

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleClick = (type) => {
    const isCorrect = type === level.correct_option;

    recordAction(level.id, isCorrect);
    if (isCorrect) completeLevel(level.id);

    const title =
      isCorrect ? "Correct!" : type === level.wrong_option ? "Wrong!" : "Neutral";

    const message = `
Correct Email: ${level.crct_email || "N/A"}
Hint: ${level.Hint || "No hint available"}
    `;

    setDialog({
      show: true,
      title,
      message,
    });

    if (isCorrect) {
      setTimeout(() => {
        if (currentIndex < levels.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          alert("🎉 All levels completed!");
        }
      }, 1500);
    }
  };

  const closeDialog = () => {
    setDialog({ ...dialog, show: false });
  };

  return (
    <>
      {/* 🔙 BACK TO DASHBOARD BUTTON */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#444",
            color: "white",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* EMAIL UI */}
      <div
        className="mail-wrapper"
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          color: "#333",
          fontFamily: "Arial",
        }}
      >
        <div className="mail-header">
          <h2>{level.subj || level.page_title}</h2>

          <div className="mail-meta">
            <p>
              <strong>From</strong>{" "}
              {level.phish_email ||
                level.crct_email ||
                level.phish_e ||
                "no email provided"}
            </p>
          </div>
        </div>

        <div className="mail-body">
          <p>{level.level_text}</p>
        </div>

        <div className="mail-actions">
          <button
            className="btn correct"
            onClick={() => handleClick(level.correct_option)}
          >
            {level.correct_option}
          </button>

          <button
            className="btn neutral"
            onClick={() => handleClick(level.neutral_option)}
          >
            {level.neutral_option}
          </button>

          <button
            className="btn wrong"
            onClick={() => handleClick(level.wrong_option)}
          >
            {level.wrong_option}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {dialog.show && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>{dialog.title}</h3>

            <pre className="dialog-message">{dialog.message}</pre>

            <button className="dialog-close" onClick={closeDialog}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
