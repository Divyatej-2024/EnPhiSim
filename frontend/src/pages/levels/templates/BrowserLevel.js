import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function BrowserMock({ children }) {
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  /* ---------------------------
     🔹 FETCH LEVEL DATA FROM LIVE SERVER
  ----------------------------*/
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/levels`)
      .then((res) => res.json())
      .then((data) => setLevels(data))
      .catch((err) => console.error("Error fetching levels:", err));
  }, []);

  /* ---------------------------
     🔹 Prevent crash while loading
  ----------------------------*/
  if (levels.length === 0) {
    return <div>Loading levels...</div>;
  }

  const level = levels[currentIndex];

  if (!level) {
    return <div>Level data not found.</div>;
  }

  const {
    id,
    page_title,
    url,
    hint,
    correct_option,
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

      {/* Render the webpage content */}
      <div className="webpage-container">
        {children
          ? React.cloneElement(children, { handleCheck })
          : <div>No webpage content provided</div>}
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
