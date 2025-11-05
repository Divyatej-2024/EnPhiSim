// src/shared/LevelTemplate.jsx
import React, { useState } from "react";
import avatar from "../pages/levels/img/avtar.png"; // place avtar.png in src/pages/levels/img/

function saveAction(record) {
  try {
    const raw = localStorage.getItem("enphisim_actions");
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(record);
    localStorage.setItem("enphisim_actions", JSON.stringify(arr));
  } catch (e) {
    console.error("Saving action failed", e);
  }
}

export default function LevelTemplate({
  id,
  title,
  category,
  content, // string or JSX
  options = [], // [{ key: "verify", label: "Verify Now" }, ...]
  correctOption, // key of correct
  nextPath // string route to next level (e.g. "/levels/easy/l3")
}) {
  const [dialog, setDialog] = useState({ visible: false, title: "", message: "", type: "" });
  const [attempts, setAttempts] = useState(0);

  const showDialog = (t, m, ty) => setDialog({ visible: true, title: t, message: m, type: ty });

  const closeDialog = (goNext = false) => {
    // capture current dialog type for post-close behavior
    const wasSuccess = dialog.type === "success";
    setDialog({ visible: false, title: "", message: "", type: "" });
    if (wasSuccess && goNext && nextPath) {
      // simple navigation
      window.location.href = nextPath;
    }
  };

  const handleAction = (optKey) => {
    const timestamp = new Date().toISOString();
    const isCorrect = optKey === correctOption;
    const rec = { levelId: id, choice: optKey, isCorrect, timestamp };
    saveAction(rec);
    setAttempts(a => a + 1);

    if (isCorrect) {
      showDialog("Correct Choice!", "Good job — you've chosen the safer action. You can proceed to the next level.", "success");
    } else {
      showDialog("Unsafe Choice", "That action is unsafe or suboptimal. Review the hints and try again — every action counts.", "error");
    }
  };

  return (
    <div>
      <style>{`
        /* Basic L1-inspired CSS (kept local for simplicity) */
        body { margin:0; }
        .level-viewport {
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background: radial-gradient(circle at center, #1e293b, #0f172a);
          font-family: 'Segoe UI', Tahoma, sans-serif;
          padding:20px;
        }
        .screen-out {
          background:#888;
          border:10px solid #2e2e2e;
          border-radius:28px;
          width:880px;
          max-width:100%;
          box-shadow:0 20px 60px rgba(0,0,0,0.5);
          padding:30px;
        }
        .screen-in {
          background:#fff;
          border-radius:18px;
          padding:22px;
          height:560px;
          overflow:auto;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.06);
        }
        .header-row { display:flex; align-items:center; gap:14px; }
        .avatar { width:60px; height:60px; border-radius:50%; border:2px solid #ddd; }
        .meta { margin-top:10px; color:#555; font-size:0.9rem; }
        .meta .badge { background:#0078d7; color:white; padding:4px 8px; border-radius:6px; font-weight:700; margin-right:8px; display:inline-block; }
        .content { margin-top:18px; color:#222; line-height:1.6; font-size:1rem; }
        .buttons { margin-top:20px; display:flex; gap:10px; flex-wrap:wrap; }
        .btn { padding:10px 16px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
        .btn-primary { background:#0078d7; color:white; }
        .btn-neutral { background:#e6e6e6; color:#111; }
        .unsubscribe { margin-top:18px; text-align:center; color:#666; font-size:0.9rem; }
        .footer { margin-top:14px; text-align:center; color:#999; font-size:0.85rem; }
        /* Dialog */
        .dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:3000; }
        .dialog { background:white; padding:20px; border-radius:12px; min-width:300px; max-width:90%; box-shadow:0 10px 40px rgba(0,0,0,0.25); }
        .dialog.success { border-top:6px solid #16a34a; }
        .dialog.error { border-top:6px solid #dc2626; }
        .dialog h3 { margin:0 0 8px 0; }
        .dialog p { margin:0 0 12px 0; color:#444; }
        .dialog .row { display:flex; justify-content:flex-end; gap:8px; }
      `}</style>

      <div className="level-viewport">
        <div className="screen-out">
          <div className="screen-in">
            <div className="header-row">
              <img src={avatar} alt="avatar" className="avatar" />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>{category}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#9ca3af" }}>Attempts: {attempts}</div>
            </div>

            <div className="meta">
              <span className="badge">{id}</span>
              <span className="meta-topic">{title}</span>
            </div>

            <div className="content">{typeof content === "string" ? <div dangerouslySetInnerHTML={{ __html: content }} /> : content}</div>

            <div className="buttons">
              {options.map(opt => (
                <button
                  key={opt.key}
                  className={`btn ${opt.style === "neutral" ? "btn-neutral" : "btn-primary"}`}
                  onClick={() => handleAction(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="unsubscribe">
              <span>Don't want to receive these messages? </span>
              <a href="#" onClick={(e)=>{ e.preventDefault(); handleAction("unsubscribe"); }}>Unsubscribe</a>
            </div>

            <div className="footer">© 2025 EnPhiSim — Every action counts</div>
          </div>
        </div>

        {dialog.visible && (
          <div className="dialog-overlay">
            <div className={`dialog ${dialog.type}`}>
              <h3>{dialog.title}</h3>
              <p>{dialog.message}</p>
              <div className="row">
                <button onClick={() => closeDialog(false)} className="btn btn-neutral">Close</button>
                {dialog.type === "success" && nextPath && (
                  <button onClick={() => closeDialog(true)} className="btn btn-primary">Next Level</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
