import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function MockMailTemplate() {
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();
  const handleClick = (option) => {
    console.log("Option clicked:", option);
  };

  const [levels, setLevels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [hover, setHover] = useState(false);               
  const [emailDialog, setEmailDialog] = useState(false);   

  const getSenderInitial = (email) =>                      
    email ? email[0].toUpperCase() : "?";

  const openEmailDialog = () =>                            
    setEmailDialog(true);

  useEffect(() => {
    async function loadLevels() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        if (!apiUrl) {
          throw new Error("API URL not set. Configure REACT_APP_API_URL");
        }

        const res = await fetch(`${apiUrl}/api/levels`);
        const text = await res.text();

        // Check if response is JSON
        if (!res.ok || text.trim().startsWith("<")) {
          throw new Error(`Expected JSON, got HTML: ${text.slice(0, 200)}...`);
        }

        setLevels(JSON.parse(text));
      } catch (err) {
        console.error("Error fetching levels:", err.message);
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

  const dummyEmails = [
    { sender: "LinkedIn", subject: "New connection request", content: "..." },
    { sender: "Amazon", subject: "Your order has shipped", content: "..." },
    { sender: level.phish_email, subject: level.subj || level.page_title, content: level.level_text, isCurrent: true },
    { sender: "Netflix", subject: "Update your payment details", content: "..." },
    { sender: "Bank of America", subject: "Security alert on your account", content: "..." },
  ];
  
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

  // Gmail styles remain unchanged
  const gmailStyles = `/* ... same as your original styles ... */`;

  return (
    <>
      <style>{gmailStyles}</style>

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

      <div className="top-bar">
        <h1>Gmail</h1>
        <input type="text" placeholder="Search mail" readOnly />
      </div>

      <div className="container-level">
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

        <div className="inbox-level">
          <div className="split-level">
            <div className="email-list-level">
              {dummyEmails.map((email, index) => (
                <div key={index} className="email-item-level" style={email.isCurrent ? { backgroundColor: '#e8f0fe' } : {}}>
                  <div className="sender">{email.sender}</div>
                  <div className="subject">{email.subject}</div>
                </div>
              ))}
            </div>

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
                        style={{
                          color: hover ? "red" : "gray",
                          cursor: "pointer",
                          marginLeft: "8px",
                          fontSize: "12px",
                        }}
                      >
                        {hover ? level.correct_info : "Show details"}
                      </span>
                    </strong>
                  </p>
                  <p>
                    <span>to me</span>
                  </p>
                  {hover && (
                    <div
                      style={{
                        position: "absolute",
                        top: "180px",
                        left: "300px",
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

              <div className="email-content-level">{level.level_text}</div>

              <div className="level-actions-container">
                <button className="btn correct" onClick={() => handleClick(level.correct_option)}>
                  {level.correct_option}
                </button>

                <button className="btn neutral" onClick={() => handleClick(level.neutral_option)}>
                  {level.neutral_option}
                </button>

                <button className="btn wrong" onClick={() => handleClick(level.wrong_option)}>
                  {level.wrong_option}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
