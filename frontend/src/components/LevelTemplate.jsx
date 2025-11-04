// src/components/LevelTemplate.jsx
import React, { useState } from "react";
import { useProgress } from "../context/ProgressContext";
import avatar from "../pages/levels/img/avtar.png"; // ensure you have this file (or update path)
import parse from "html-react-parser"; // optional; npm i html-react-parser

export default function LevelTemplate({ level }) {
  const { recordAction } = useProgress();
  const [dialog, setDialog] = useState({ visible: false, title: "", message: "", type: "" });
  const [attempts, setAttempts] = useState(0);

  if (!level) return <div style={{padding:40,color:"#fff"}}>Level not found.</div>;

  const handleAction = (option) => {
    const isCorrect = option.id === level.correctOption;
    // every action counts — log it
    recordAction(level.id, option.id, isCorrect, isCorrect ? level.points : 0);
    setAttempts(a => a + 1);

    if (isCorrect) {
      setDialog({
        visible: true,
        title: "Correct Choice!",
        message: `Well done — you've earned ${level.points} points.`,
        type: "success"
      });
    } else {
      setDialog({
        visible: true,
        title: "Incorrect / Unsafe",
        message: "That action was unsafe. Check the hints and try again — every action counts.",
        type: "error"
      });
    }
  };

  const closeDialog = (navigateToNext) => {
    setDialog({ visible: false, title: "", message: "", type: "" });
    if (dialog.type === "success" && level.nextLevel && navigateToNext) {
      window.location.href = `/levels/${level.nextLevel}`; // simple redirect
    }
  };

  // Inline styles for simplicity (copy your L1 CSS if you want)
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at center, #1e293b, #0f172a)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        width: 780,
        maxWidth: "95%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        overflow: "hidden"
      }}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #ddd" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{level.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{level.category}</div>
            </div>
            <div style={{ marginLeft: "auto", color: "#888", fontSize: 13 }}>
              Attempts: {attempts}
            </div>
          </div>

          <div style={{ marginTop: 18, color: "#222", lineHeight: 1.6 }}>
            {parse ? parse(level.content) : <div dangerouslySetInnerHTML={{ __html: level.content }} />}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {level.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleAction(opt)}
                style={{
                  background: opt.id === level.correctOption ? "#0078d7" : "#ccc",
                  color: opt.id === level.correctOption ? "#fff" : "#333",
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.12s"
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0px)"}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 12, color: "#666", fontSize: 13 }}>
            <div><strong>Hints:</strong></div>
            <ul>
              {level.hints.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#999" }}>© 2025 EnPhiSim</div>
            <div style={{ fontSize: 12, color: "#999" }}>
              Every action counts — each click is recorded.
            </div>
          </div>
        </div>
      </div>

      {dialog.visible && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#fff", padding: 20, borderRadius: 12, minWidth: 320, boxShadow: "0 6px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: 0 }}>{dialog.title}</h3>
            <p style={{ color: "#444" }}>{dialog.message}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => closeDialog(false)} style={{ padding: "8px 12px", borderRadius: 6 }}>Close</button>
              {dialog.type === "success" && level.nextLevel && (
                <button onClick={() => closeDialog(true)} style={{ padding: "8px 12px", borderRadius: 6, background: "#0078d7", color: "#fff" }}>
                  Next Level
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
