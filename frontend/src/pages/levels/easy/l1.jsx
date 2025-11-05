import React, { useState } from "react";
import avatar from "../img/avtar.png";
import { useNavigate } from "react-router-dom";

function L1() {
  const navigate = useNavigate();
  const [actionLog, setActionLog] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  const logAction = (action) => {
    setActionLog((prev) => [...prev, action]);
    console.log("User Action:", action);
  };

  const handleClickLink = () => {
    logAction("Clicked on suspicious link");
    setAlertMsg("This link looks suspicious. Are you sure you want to continue?");
  };

  const handleReport = () => {
    logAction("Reported phishing attempt");
    setAlertMsg("Good job! You correctly reported this phishing email.");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const handleIgnore = () => {
    logAction("Ignored the email");
    setAlertMsg("You ignored the email but didn’t report it. Stay alert!");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#1e293b",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2 className="text-xl font-bold mb-2">📧 Email: "Account Security Alert"</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={avatar} alt="sender" width="50" style={{ borderRadius: "50%" }} />
          <div>
            <p><b>From:</b> security@support-login.com</p>
            <p><b>To:</b> you@example.com</p>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", background: "#0f172a", padding: "1rem", borderRadius: "10px" }}>
          <p>Hello,</p>
          <p>
            We detected a suspicious login attempt to your account. Please verify your credentials immediately to prevent suspension.
          </p>
          <a
            href="#"
            onClick={handleClickLink}
            style={{
              color: "#3b82f6",
              display: "inline-block",
              marginTop: "1rem",
              textDecoration: "underline",
            }}
          >
            Verify Your Account
          </a>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleReport}
            style={{
              background: "#16a34a",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Report as Phishing
          </button>
          <button
            onClick={handleIgnore}
            style={{
              background: "#f59e0b",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Ignore
          </button>
        </div>

        {alertMsg && (
          <div
            style={{
              marginTop: "1.5rem",
              background: "#0f172a",
              borderLeft: "4px solid #38bdf8",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <p>{alertMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default L1;
