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

  const [hover, setHover] = useState(false);

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleClick = (type) => {
    const isCorrect = type === level.correct_option;

    recordAction(level.id, isCorrect);
    if (isCorrect) completeLevel(level.id);

    const title = isCorrect
      ? "Correct!"
      : type === level.wrong_option
      ? "Wrong!"
      : "Neutral";

    const message = `Correct Email: ${level.crct_email || "N/A"}
Hint: ${level.Hint || "No hint provided"}`;

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

  const openEmailDialog = () => {
    setDialog({
      show: true,
      title: "Verified Sender Information",
      message: `Correct Email: ${level.crct_email || "N/A"}`,
    });
  };

  return (
    <>
      {/* BACK TO DASHBOARD */}
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
            align:"left",
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
          marginTop:"500px",
          marginRight:"500px",
          marginLeft:"500px",
          position: "relative",
        }}
      >
        {/* HEADER */}
        <div className="mail-header">
          <h2>{level.subj || level.page_title}</h2>

          <div className="mail-meta" style={{ marginTop: "4px" }}>
            <p style={{ display: "inline-block", position: "relative" }}>
              <strong>From:</strong>{" "}
              <span
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={openEmailDialog}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#0066cc",
                }}
              >
                {level.phish_email}
              </span>

              {/* Hover pop-up shows correct email */}
              {hover && (
                <div
                  style={{
                    position: "absolute",
                    top: "22px",
                    left: 0,
                    background: "#f5f5f5",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "13px",
                    width: "220px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    zIndex: 50,
                  }}
                >
                  <strong>Correct Email:</strong>
                  <br />
                  {level.crct_email}
                </div>
              )}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="mail-body" style={{ marginTop: "15px" }}>
          <p>{level.level_text}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mail-actions" style={{ marginTop: "20px" }}>
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

      {/* DIALOG BOX */}
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
