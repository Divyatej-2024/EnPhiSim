import React from "react";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function MailTemplate({ level }) {
  const { recordAction, completeLevel } = useProgress();

  const handleClick = (type) => {
    let isCorrect = type === level.correct_option;

    recordAction(level.id, isCorrect);
    if (isCorrect) completeLevel(level.id);
  };

  return (
    <div className="mail-wrapper">
      <div className="mail-header">
        <h2>{level.subj || level.page_title}</h2>

        <div className="mail-meta">
          <p>
            <strong>From:</strong>{" "}
            {level.from_and_to ? level.from_and_to.split(" to ")[0] : "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {level.phish_email || level.phish_e}
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
  );
}
