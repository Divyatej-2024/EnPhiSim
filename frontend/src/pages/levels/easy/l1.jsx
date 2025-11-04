import React from "react";

const AccountVerification = () => {
  const sender = "securety@enphisim.com";
  const recipient = "user@enphisim.com";
  const level = "L1";
  const topic = "Mass Credential-Phish";

  // ❌ Wrong option popup
  const handleWrongOption = (e) => {
    e.preventDefault();
    alert("⚠️ This is a phishing simulation.\n\nYou clicked a malicious link. This was the WRONG option!\nAlways verify sender details and URLs before clicking.");
  };

  // ✅ Correct option popup
  const handleCorrectOption = (e) => {
    e.preventDefault();
    alert("✅ Correct! You recognized the phishing attempt and avoided clicking any suspicious link.");
  };

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        body {
          /*background-color: #f1f1f1;*/
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .screen-out {
          background: grey;
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
          padding: 20px;
        }
        .content {
          text-align: left;
        }
        img {
          width: 60px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .info {
          margin-bottom: 15px;
          font-size: 14px;
          color: #333;
        }
        .info span {
          display: block;
        }
        .text {
          padding: 10px 0;
          line-height: 1.6;
          color: #444;
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
        }
        .meta-level {
          background: #fde68a;
          color: #92400e;
          padding: 4px 8px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .meta-topic {
          background: #eef2ff;
          color: #1e3a8a;
          padding: 4px 8px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .buttons {
          margin-top: 15px;
        }
        .verify-btn {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-right: 10px;
          font-size: 14px;
          transition: background 0.3s ease;
        }
        .verify-btn:hover {
          background: #0056b3;
        }
        .secondary {
          background: #e0e0e0;
          color: #333;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }
        .secondary:hover {
          background: #c7c7c7;
        }
        .unsubscribe {
          margin-top: 15px;
          font-size: 12px;
          color: #666;
          text-align: center;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .unsubscribe a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }
        .unsubscribe a:hover {
          text-decoration: underline;
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

      {/* JSX */}
      <div className="screen-out">
        <div className="screen-in">
          <div className="content">
            <div>
              <img src="avtar.png" alt="Avatar" />
              <div className="info">
                <span><strong>Sender:</strong> {sender}</span>
                <span><strong>Recipient:</strong> {recipient}</span>
              </div>
            </div>

            <div className="text">
              <p className="greeting">Hello User,</p>

              <div className="meta">
                <span className="meta-level">{level}</span>
                <span className="meta-topic">{topic}</span>
              </div>

              <p>Your account verification session has timed out for security reasons.</p>
              <p className="notice">
                To regain access, please re-verify your account by clicking the button below.
                If you did not request this, ignore this message or click Unsubscribe below.
              </p>

              <div className="buttons">
                <a href="#" className="verify-btn" role="button" onClick={handleWrongOption}>
                  Re-Verify Account
                </a>
                <button className="secondary" type="button" onClick={handleWrongOption}>
                  Remind me later
                </button>
              </div>
            </div>
          </div>

          <div className="unsubscribe">
            You’re receiving this message because you have an active EnPhiSim account.<br />
            <a href="#" onClick={handleCorrectOption}>Unsubscribe</a> from similar notifications.
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountVerification;
