import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { levels } from "../../levels/level_data";
import "../../../level.css"; // make sure to create this file or change the path

export default function BrowserMock({ url, onOptionClick, onNextLevel, children }) {
if (!level) return <div>Level data not found.</div>;
  const {
    level_text,
    page_title,
    phish_email,
    crct_email,
    from_and_to,
    subj,
    category,
    id,
  } = level;

  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  // Ensure the levels data is available. Using the first item for the current "open email"
  const level = levels[currentIndex] || {};

  const [hover, setHover] = useState(false);

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  // Dummy email list items to simulate a full inbox
  const dummyEmails = [
    { sender: "LinkedIn", subject: "New connection request", content: "..." },
    { sender: "Amazon", subject: "Your order has shipped", content: "..." },
    { sender: level.phish_email, subject: level.subj || level.page_title, content: level.level_text, isCurrent: true },
    { sender: "Netflix", subject: "Update your payment details", content: "..." },
    { sender: "Bank of America", subject: "Security alert on your account", content: "..." },
  ];

  const handleClick = (type) => {
    const isCorrect = type === level.correct_option;

    recordAction(level.id, isCorrect);
    if (isCorrect) completeLevel(level.id);

    const title = isCorrect
      ? "Correct!"
      : type === level.wrong_option
      ? "Wrong!"
      : "Neutral";

    const message = `Correct Email: ${level.crct_email || "N/A"}\nHint: ${level.Hint || "No hint provided"}`;

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

  const getSenderInitial = (email) => {
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <div className="browser-window">

      {/* Browser Top */}
      <div className="top-bar">
        <div className="traffic-lights">
          <div className="light red"></div>
          <div className="light yellow"></div>
          <div className="light green"></div>
        </div>

        <div className="tabs">
          <div className="tab active">{level.page_title || "ENPHISIM"}</div>
          <div className="tab">New Tab</div>
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
          value={url || "https://example.com"}
          readOnly
        />
      </div>

      {/* Webpage Content */}
      <div className="webpage-container">{children}</div>
    </div>
  );
}
