import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { levels } from "../../levels/level_data";
import "../../../level.css";

export default function BrowserMock({ children }) {

  /* ---------------------------
     🔹 ALWAYS: Hooks go first
  ----------------------------*/
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Get current level (browser type)
  const level = levels[currentIndex];

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  /* ---------------------------
     🔹 Prevent crash if no data
  ----------------------------*/
  if (!level) {
    return <div>Level data not found.</div>;
  }

  const {
    id,
    page_title,
    url,
    hint,
    correct_option,
    wrong_option,
    correct_info,
  } = level;

  /* ---------------------------
     🔹 When user clicks option
  ----------------------------*/
  const handleCheck = (option) => {
    const isCorrect = option === correct_option;

    recordAction(id, isCorrect);
    if (isCorrect) completeLevel(id);

    setDialog({
      show: true,
      title: isCorrect ? "Correct!" : "Incorrect!",
      message: `Correct Info: ${correct_info}\nHint: ${hint}`,
    });

    // Move to next level
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

  return (
    <div className="browser-window">

      {/* Browser Top Bar */}
      <div className="top-bar">
        <div className="traffic-lights">
          <div className="light red"></div>
          <div className="light yellow"></div>
          <div className="light green"></div>
        </div>

        <div className="tabs">
          <div className="tab active">{page_title}</div>
          <div className="tab">+</div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-btn">←</div>
        <div className="nav-btn">→</div>
        <div className="nav-btn">⟳</div>

        <input
          className="url-bar"
          type="text"
          value={url}
          readOnly
        />
      </div>

      {/* Render the webpage content (HTML layout you created) */}
      <div className="webpage-container">
        {React.cloneElement(children, { handleCheck })}
      </div>

      {/* Dialog Popup */}
      {dialog.show && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            <button onClick={closeDialog}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
