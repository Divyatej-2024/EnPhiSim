import React, { useState } from "react";
import avtar from "../img/avtar.png"; 

export default function Level1MassCredentialPhish() {
  const [dialog, setDialog] = useState({ visible: false, title: "", message: "", type: "" });

  const showDialog = (title, message, type) => {
    setDialog({ visible: true, title, message, type });
  };

  const closeDialog = () => {
    setDialog({ visible: false, title: "", message: "", type: "" });
    if (dialog.type === "success") {
      window.location.href = "/levels/easy/l2"; // redirect after correct choice
    }
  };

  const handleAction = (action) => {
    if (action === "unsubscribe") {
      showDialog("Correct Choice!", "This was a phishing email. Redirecting to the next level...", "success");
    } else {
      showDialog("Wrong Choice!", "That option was unsafe. Please identify the phishing indicator and try again.", "error");
    }
  };

  return (
    <div>
      <style>{`
        body {
          background: radial-gradient(circle at center, #1e293b, #0f172a);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .screen-out {
          background: #888;
          border: 12px solid #2e2e2e;
          border-radius: 40px;
          padding: 30px;
          width: 820px;
          height: 550px;
          box-shadow: 0 0 40px rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .screen-in {
          background: #fff;
          border-radius: 25px;
          border: 2px solid #ccc;
          width: 700px;
          height: 500px;
          padding: 25px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
          overflow-y: auto;
        }
        .content { text-align: left; }
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 10px;
          border: 2px solid #ddd;
        }
        .info { margin-bottom: 15px; font-size: 14px; color: #333; }
        .info span { display: block; margin-bottom: 3px; }
        .info .sender:hover + .phish-hint { opacity: 1; }
        .phish-hint {
          font-size: 0.9rem;
          color: red;
          margin-top: 3px;
          font-style: italic;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
        }
        .meta {
          margin-top: 10px;
          font-size: 0.85rem;
          color: #555;
        }
        .meta-level {
          background: #0078d7;
          color: white;
          padding: 4px 8px;
          border-radius: 5px;
          font-weight: 700;
          margin-right: 8px;
        }
        .meta-topic { color: #0078d7; font-weight: bold; }
        .text { padding: 20px 0; color: #333; line-height: 1.6; }
        .buttons { margin-top: 20px; display: flex; gap: 10px; }
        .verify-btn, .secondary {
          background: #0078d7;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
          border: none;
        }
        .verify-btn:hover { background: #005bb5; }
        .secondary { background: #ccc; color: #333; }
        .secondary:hover { background: #aaa; }
        .unsubscribe {
          margin-top: 25px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          font-size: 0.85rem;
          color: #666;
          text-align: center;
        }
        .unsubscribe a {
          color: #0078d7;
          font-weight: bold;
          text-decoration: none;
        }
        .unsubscribe a:hover { text-decoration: underline; }
        footer {
          text-align: center;
          margin-top: 15px;
          font-size: 0.8rem;
          color: #999;
        }

        /* ---------- Custom Dialog ---------- */
        .dialog-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .dialog-box {
          background: white;
          padding: 25px 30px;
          border-radius: 15px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          animation: pop 0.3s ease-in-out;
        }
        .dialog-box h3 {
          margin-top: 0;
          color: #111;
        }
        .dialog-box p { color: #444; font-size: 0.95rem; }
        .dialog-box button {
          margin-top: 15px;
          background: #0078d7;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .dialog-box button:hover { background: #005bb5; }
        .dialog-box.success { border-top: 6px solid #16a34a; }
        .dialog-box.error { border-top: 6px solid #dc2626; }
        @keyframes pop {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="screen-out">
        <div className="screen-in">
          <div className="content">
            <img src={avtar} alt="Avatar" />
            <div className="info">
              <span className="sender">From: security@enphisim.com</span>
              <div className="phish-hint">Phishing Email</div>
              <span className="recipient">To: user@enphisim.com</span>
            </div>
            <div className="meta">
              <span className="meta-level">L1</span>
              <span className="meta-topic">Mass Credential-Phish</span>
            </div>
            <div className="text">
              <p><strong>Hello User,</strong></p>
              <p>Your account verification has timed out. Please click below to re-verify your account immediately to avoid suspension.</p>
            </div>
            <div className="buttons">
              <button className="verify-btn" onClick={() => handleAction("verify")}>Verify Now</button>
              <button className="secondary" onClick={() => handleAction("remind")}>Remind Me Later</button>
            </div>
            <div className="unsubscribe">
              <p>
                Don’t want to receive these emails anymore?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); handleAction("unsubscribe"); }}>
                  Unsubscribe
                </a>
              </p>
            </div>
            <footer>© 2025 EnPhiSim</footer>
          </div>
        </div>
      </div>

      {dialog.visible && (
        <div className="dialog-overlay">
          <div className={`dialog-box ${dialog.type}`}>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            <button onClick={closeDialog}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
