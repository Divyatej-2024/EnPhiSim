import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { Link } from "react-router-dom";
import "../../../level.css";

export default function ImageLevel() {
const onOptionClick = (option) => {
  const isCorrect = option.key === "correct";

  recordAction(id, option.key);

  if (isCorrect) {
    completeLevel(id);
    navigate("/dashboard");
  } else {
    alert("Incorrect! Try again.");
  }
};



  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [currentIndex] = useState(0);


  /* ---------------------------
     🔹 FETCH LEVEL DATA FROM LIVE SERVER
  ----------------------------*/
useEffect(() => {
  async function loadLevels() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/levels`
      );

      const text = await res.text();

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = JSON.parse(text);
      setLevels(Array.isArray(json) ? json : json.levels || []);
    } catch (err) {
      console.error("❌ Error fetching levels:", err.message);
    }
  }

  loadLevels();
}, []);

  /* ---------------------------
     🔹 Prevent crash while loading
  ----------------------------*/
  if (levels.length === 0) {
    return <div>Loading levels...</div>;
  }

const level = levels[currentIndex];
if (!level) return <div>Level data not found.</div>;

const {
  id,
  page_title,
  /*url,*/
//   hint,
//   correct_option,
//   correct_info,
  from_and_to,
  subject,
  crct_email,
  phish_email,
  level_text,
  options,
  category,
} = level;

  /* ---------------------------
     🔹 When user clicks option
  ----------------------------
  const handleCheck = (option) => {
    const isCorrect = option === correct_option;

    recordAction(id, isCorrect);
    if (isCorrect) completeLevel(id);

    setDialog({
      show: true,
      title: isCorrect ? "Correct!" : "Incorrect!",
      message: `Correct Info: ${correct_info}\nHint: ${hint}`,
    });

    if (isCorrect) {
      setTimeout(() => {
        if (currentIndex < levels.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          navigate("/thankyou");
        }
      }, 1200);
    }
  };

  const closeDialog = () =>
    setDialog({ ...dialog, show: false });

*/
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
        {/* Page Title */}
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>{page_title}</h2>

        {/* Email Header */}
        <div style={header}>
          <img
            src="/avtar.png"
            alt="Profile"
            style={profilePhoto}
          />
          <div style={{ color: "#333" }}>
            <p><strong>From/To:</strong> {from_and_to || "sender@example.com"}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p>
              <strong>Email:</strong>{" "}
              <span title={crct_email}>{phish_email}</span>
            </p>
          </div>
        </div>

        {/* Email Body */}
        <div style={{ padding: "20px", background: "#fff", color: "#333" }}>
          {level_text || "This is the email body."}
        </div>

        {/* Options */}
        <div style={optionsContainer}>
          {options.map(opt => {
            if (opt.type === "link") {
              return (
                <Link
                  key={opt.key}
                  to={`/levels/${category}/l${id + 1}`}
                  style={correctButton}
                  onClick={() => onOptionClick(opt)}
                >
                  {opt.label}
                </Link>
              );
            } else {
              return (
                <button
                  key={opt.key}
                  style={opt.key === "wrong" ? wrongButton : neutralButton}
                  onClick={() => onOptionClick(opt)}
                >
                  {opt.label}
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
