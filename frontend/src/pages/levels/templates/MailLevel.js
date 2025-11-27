import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function MailLevel({ level, allLevels }) {
  // ⬇️ MUST BE AT TOP — BEFORE ANY CONDITIONAL RETURN
  const navigate = useNavigate();
  const { recordAction, completeLevel } = useProgress();

  // ⬇️ ALLOW EARLY RETURN ONLY AFTER HOOKS
  if (!level) {
    return <div>Level data not found.</div>;
  }

  const {
    level_text,
    page_title,
    phish_email,
    crct_email,
    from_and_to,
    subj,
    category,
    id,
    correct_option,
    wrong_option,
    neutral_option,
  } = level;

  const subject = subj || "No Subject";

  // GET NEXT LEVEL
  const nextLevel = allLevels.find((l) => l.id === id + 1);
  const nextPath = nextLevel
    ? `/levels/${nextLevel.category}/${nextLevel.Level_no}`
    : "/dashboard";

  const options = [
    { key: "correct", label: correct_option, correct: true },
    { key: "wrong", label: wrong_option, correct: false },
    { key: "neutral", label: neutral_option, correct: false },
  ].filter((opt) => opt.label);

  const handleOptionClick = (opt) => {
    recordAction(id, opt.correct);
    if (opt.correct) {
      completeLevel(id);
      navigate(nextPath);
    } else {
      alert("This action is risky. Try again!");
    }
  };

  // STYLES
  const container = {
    background: "#f8f8f8",
    maxWidth: "800px",
    margin: "20px auto",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const header = {
    background: "#fff",
    padding: "20px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const profilePhoto = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const optionsContainer = {
    padding: "20px",
    textAlign: "center",
  };

  const buttonBase = {
    margin: "0 10px",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    border: "none",
    transition: "0.2s",
  };

  const correctButton = { ...buttonBase, background: "#4CAF50", color: "#fff" };
  const wrongButton = { ...buttonBase, background: "#f44336", color: "#fff" };
  const neutralButton = { ...buttonBase, background: "#ccc", color: "#333" };
  const backButton = { ...buttonBase, background: "#2196F3", color: "#fff" };

  return (
    <div>
      {/* Back to Dashboard */}
      <div style={{ textAlign: "center", paddingBottom: "20px" }}>
        <Link to="/dashboard" style={backButton}>
          Back to Dashboard
        </Link>
      </div>

      <div style={container}>
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>{page_title}</h2>

        {/* Email Header */}
        <div style={header}>
          <img src="/avtar.png" alt="Profile" style={profilePhoto} />
          <div style={{ color: "#333" }}>
            <p>
              <strong>From/To:</strong> {from_and_to}
            </p>
            <p>
              <strong>Subject:</strong> {subject}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <span title={crct_email}>{phish_email}</span>
            </p>
          </div>
        </div>

        {/* Email Body */}
        <div style={{ padding: "20px", background: "#fff", color: "#333" }}>
          {level_text}
        </div>

        {/* Options */}
        <div style={optionsContainer}>
          {options.map((opt) => (
            <button
              key={opt.key}
              style={
                opt.key === "correct"
                  ? correctButton
                  : opt.key === "wrong"
                  ? wrongButton
                  : neutralButton
              }
              onClick={() => handleOptionClick(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
