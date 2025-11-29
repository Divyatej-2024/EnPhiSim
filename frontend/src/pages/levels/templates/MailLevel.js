import React, { useState } from "react";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function MailTemplate({ level, onNextLevel }) {
  const { recordAction, completeLevel } = useProgress();

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleClick = (type) => {
    const isCorrect = type === level.correct_option;

    recordAction(level.id, isCorrect);
    if (isCorrect) completeLevel(level.id);

    // Set modal content
    let title = "";
    if (isCorrect) title = "Correct!";
    else if (type === level.wrong_option) title = "Wrong!";
    else title = "Neutral";

    let message = `
Correct Email: ${level.crct_email || "N/A"}
Hint: ${level.Hint || "No hint available"}
    `;

    setDialog({
      show: true,
      title,
      message,
    });

    // 🔥 Auto redirect to next level on correct answer
    if (isCorrect) {
      setTimeout(() => {
        if (onNextLevel) onNextLevel();
      }, 1500); // 1.5 seconds delay
    }
  };

  const closeDialog = () => {
    setDialog({ ...dialog, show: false });
  };

  return (
    <>
      <div className="mail-wrapper">
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

      {/* Modal */}
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
