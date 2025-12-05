import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { levels } from "../../levels/level_data";
import "../../../level.css"; // Keep original styles for buttons/dialogs

// Import custom styles for the new Gmail-like layout
// NOTE: For a real project, you would put the CSS in a dedicated file,
// but for this example, the styles are included as a string/object for demonstration.

const gmailStyles = `
  .top-bar {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 10px 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  .top-bar h1 {
    font-size: 20px;
    color: #202124;
    margin: 0;
    flex-grow: 1;
    cursor: default;
  }
  .top-bar input {
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #dcdcdc;
    width: 300px;
  }
  .container-level {
    display: flex;
    height: calc(100vh - 50px);
    background-color: #f1f3f4;
  }
  .sidebar-level {
    width: 220px;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 1px 0 2px rgba(0,0,0,0.1);
  }
  .sidebar-level button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 4px;
    background-color: #1a73e8;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  .sidebar-level ul {
    list-style: none;
    padding: 0;
    margin-top: 20px;
  }
  .sidebar-level ul li {
    padding: 10px 5px;
    cursor: pointer;
    border-radius: 4px;
    color: #333;
  }
  .sidebar-level ul li:hover, .sidebar-level ul li.active {
    background-color: #e8f0fe;
    color: #1a73e8;
  }
  .inbox-level {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .split-level {
    display: flex;
    height: 100%;
  }
  .email-list-level {
    width: 350px; /* Wider to show sender/subject */
    overflow-y: auto;
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
  }
  .email-item-level {
    background-color: white;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: block;
    cursor: pointer;
  }
  .email-item-level:hover {
    background-color: #f5f5f5;
  }
  .email-item-level .sender {
    font-weight: bold;
    color: #202124;
  }
  .email-item-level .subject {
    color: #5f6368;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .email-preview-level {
    flex: 1;
    padding: 30px;
    background-color: white;
    overflow-y: auto;
  }
  .email-header-level {
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 20px;
    color: #202124;
  }
  .email-from-level {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }
  .email-from-level .avatar {
    background-color: #fbbc04;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    margin-right: 15px;
  }
  .email-from-level .info p {
    margin: 0;
    line-height: 1.4;
  }
  .email-from-level .info strong {
    font-weight: bold;
    color: #202124;
  }
  .email-from-level .info span {
    font-size: 12px;
    color: #5f6368;
  }
  .email-content-level {
    line-height: 1.8;
    color: #333;
    white-space: pre-wrap; /* To respect line breaks in level_text */
  }
  .level-actions-container {
    padding: 20px 0;
    border-top: 1px solid #e0e0e0;
    margin-top: 20px;
    text-align: center;
  }
  .level-actions-container button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
  }
  /* Original dialog styles from level.css are assumed to handle the dialog-overlay/box */
`;

export default function MockMailLevelPage() {
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
    <>
      {/* Inject custom styles */}
      <style>{gmailStyles}</style>

      {/* BACK TO DASHBOARD - moved outside the main mail container */}
      <div style={{ padding: "10px 20px", textAlign: "left", backgroundColor: "#ffffff", borderBottom: "1px solid #dcdcdc" }}>
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

      {/* TOP BAR */}
      <div className="top-bar">
        <h1>Gmail</h1>
        <input type="text" placeholder="Search mail" readOnly />
      </div>

      <div className="container-level">
        {/* SIDEBAR */}
        <div className="sidebar-level">
          <button>Compose</button>
          <ul>
            <li className="active">Inbox</li>
            <li>Starred</li>
            <li>Sent</li>
            <li>Drafts</li>
            <li>Trash</li>
          </ul>
        </div>

        {/* INBOX/EMAIL VIEW */}
        <div className="inbox-level">
          <div className="split-level">
            {/* EMAIL LIST */}
            <div className="email-list-level">
              {dummyEmails.map((email, index) => (
                <div key={index} className="email-item-level" style={email.isCurrent ? { backgroundColor: '#e8f0fe' } : {}}>
                  <div className="sender">{email.sender}</div>
                  <div className="subject">{email.subject}</div>
                </div>
              ))}
            </div>

            {/* EMAIL PREVIEW (The current level's content) */}
            <div className="email-preview-level">
              <div className="email-header-level">{level.subj || level.page_title}</div>

              <div className="email-from-level">
                <div className="avatar">{getSenderInitial(level.phish_email)}</div>
                <div className="info">
                  <p>
                    <strong>
                      {level.phish_email}{" "}
                      <span
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={openEmailDialog}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "#1a73e8",
                          marginLeft: "5px",
                        }}
                      >
                        &lt;{level.phish_email}&gt;
                      </span>
                    </strong>
                  </p>
                  <p>
                    <span>to me</span>
                  </p>
                  {/* Hover pop-up shows correct email - positioned relative to the overall email-preview-level */}
                  {hover && (
                    <div
                      style={{
                        position: "absolute",
                        top: "180px", // Adjust based on final layout
                        left: "300px", // Adjust based on final layout
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
                </div>
              </div>

              <div className="email-content-level">
                {level.level_text}
              </div>

              {/* ACTION BUTTONS - integrated into the email body */}
              <div className="level-actions-container">
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
          </div>
        </div>
      </div>

      {/* DIALOG BOX (from original component) */}
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