import React, { useState } from "react";

const AccountVerification = () => {
  const [hoverSender, setHoverSender] = useState(false);

  // ⚠️ Wrong option popup
  const handleWrongOption = (e) => {
    e.preventDefault();
    alert(
      "⚠️ This is a phishing simulation.\n\nYou clicked a malicious link. This was the WRONG option!\nAlways verify sender details and URLs before clicking."
    );
  };

  // ✅ Correct option popup + redirect
  const handleCorrectOption = (e) => {
    e.preventDefault();
    alert(
      "✅ Correct! You recognized the phishing attempt and avoided clicking any suspicious link.\n\nRedirecting you to the next level..."
    );
    setTimeout(() => {
      window.location.href = "/level2"; // redirect to next level
    }, 2000);
  };

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        body {
          background: linear-gradient(to bottom right, #0f172a, #1e293b);
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .screen-out {
          background: grey;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          border: 2px solid grey;
          border-radius: 30px;
          padding: 20px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .screen-in {
          background: white;
          border: 2px solid grey;
          border-radius: 30px;
          width: 400px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .content {
          text-align: left;
        }

        .content img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .info {
          margin-bottom: 15px;
          font-size: 14px;
          color: #333;
          margin-top: 10px;
        }

        .info span {
          display: block;
          margin-bottom: 3px;
        }

        .text {
          padding: 10px 0;
          line-height: 1.6;
          color: #444;
          margin-top: 15px;
        }

        .greeting {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .meta {
          margin: 10px 0;
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          color: #555;
        }

        .meta-level {
          background: #0078d7;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 8px;
        }

        .meta-topic {
          color: #0078d7;
          font-weight: bold;
        }

        .notice {
          margin: 10px 0;
          color: #333;
        }

        .buttons {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .verify-btn, .secondary {
          background: #0078d7;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-right: 10px;
          font-size: 14px;
          transition: background 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .verify-btn:hover {
          background: #0056b3;
        }

        .secondary {
          background: #888;
        }

        .secondary:hover {
          background: #666;
        }

        .unsubscribe {
          margin-top: 15px;
          font-size: 0.8rem;
          color: #666;
          text-align: center;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }

        .unsubscribe a {
          color: #0078d7;
          text-decoration: none;
          font-weight: bold;
        }

        .unsubscribe a:hover {
          text-decoration: underline;
        }

        .phish-hint {
          font-size: 0.8rem;
          color: red;
          margin-top: 5px;
          font-style: italic;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
        }

        .phish-hint.show {
          opacity: 1;
        }

        @media (max-width: 600px) {
          .screen-out {
            max-width: 90%;
            padding: 15px;
          }
          .verify-btn, .secondary {
            width: 100%;
            margin-bottom: 10px;
          }
        }
      `}</style>

      <div className="screen-out">
        <div className="screen-in">
          <div className="content">
            <img src="avtar.png" alt="Avatar" />
            <div className="info">
              <span
                onMouseEnter={() => setHoverSender(true)}
                onMouseLeave={() => setHoverSender(false)}
              >
                <strong>Sender:</strong> securety@enphisim.com
              </span>
              <div className={`phish-hint ${hoverSender ? "show" : ""}`}>
                ⚠️ Phishing Email
              </div>
              <span>
                <strong>Recipient:</strong> user@enphisim.com
              </span>
            </div>

            <div className="text">
              <p className="greeting">Hello User,</p>

              <div className="meta">
                <span className="meta-level">L1</span>
                <span className="meta-topic">Mass Credential-Phish</span>
              </div>

              <p>
                Your account verification session has timed out for security
                reasons.
              </p>
              <p className="notice">
                To regain access, please re-verify your account by clicking the
                button below. If you did not request this, ignore this message
                or click Unsubscribe below.
              </p>

              <div className="buttons">
                <a href="#" className="verify-btn" onClick={handleWrongOption}>
                  Verify
                </a>
                <button className="secondary" onClick={handleWrongOption}>
                  Remind Later
                </button>
              </div>
            </div>
          </div>

          <div className="unsubscribe">
            You’re receiving this message because you have an active EnPhiSim
            account.<br />
            <a href="#" onClick={handleCorrectOption}>
              Unsubscribe
            </a>{" "}
            from similar notifications.
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountVerification;
