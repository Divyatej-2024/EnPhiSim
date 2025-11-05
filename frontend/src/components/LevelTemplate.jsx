// src/shared/LevelTemplate.jsx
import React, { useEffect, useRef, useState } from "react";
import avatar from "../pages/levels/img/avtar.png"; // add your image here
import { useProgress } from "../context/ProgressContext";

/*
Level shape (from data/levels.js):
{
  id: "l1",
  title: "...",
  category: "easy",
  contentHtml: "...",
  events: [{ t:0, type:"arrive_email", data:{} }, ...],
  actions: [{ id:"verify", label:"Verify Now", linkKey:"phish_link" }, ...],
  correctAction: "unsubscribe",
  nextLevel: "/levels/easy/l2",
  hints: [...],
  points: 10,
  mlCheck: { enabled:false, endpoint: "/api/predict" }
}
*/

export default function LevelTemplateRealtime({ level }) {
  const { recordAction } = useProgress();
  const [time, setTime] = useState(0);
  const [eventsLog, setEventsLog] = useState([]);
  const [flags, setFlags] = useState({});
  const [hintsUnlocked, setHintsUnlocked] = useState([]);
  const [dialog, setDialog] = useState({ visible: false, title: "", message: "", type: "" });
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!level || startedRef.current) return;
    startedRef.current = true;
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [level]);

  useEffect(() => {
    if (!level || !level.events) return;
    const toFire = level.events.filter(e => e.t === time);
    toFire.forEach(ev => handleEvent(ev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const pushLog = (entry) => setEventsLog(prev => [...prev, { time, ...entry }]);

  const handleEvent = (ev) => {
    pushLog({ type: ev.type, data: ev.data || {} });
    switch (ev.type) {
      case "arrive_email":
        setFlags(f => ({ ...f, emailArrived: true }));
        break;
      case "followup":
        setFlags(f => ({ ...f, followupText: ev.data.text || true }));
        if (ev.data.unlockHint) {
          setTimeout(() => setHintsUnlocked(h => Array.from(new Set([...h, ev.data.unlockHint]))), 500);
        }
        break;
      case "activate_link":
        setFlags(f => ({ ...f, [ev.data.key]: true }));
        setTimeout(() => {
          setFlags(f => ({ ...f, [ev.data.key]: false }));
          pushLog({ type: "deactivate_link", key: ev.data.key });
        }, (ev.data.duration || 10) * 1000);
        break;
      case "unlock_hint":
        setHintsUnlocked(h => Array.from(new Set([...h, ev.data.hint])));
        break;
      case "escalation":
        setFlags(f => ({ ...f, escalation: ev.data || true }));
        break;
      case "ml_check":
        if (level.mlCheck && level.mlCheck.enabled) {
          runMlCheck(level.contentPlain || level.contentHtml).then(res => {
            setFlags(f => ({ ...f, mlScore: res }));
            pushLog({ type: "ml_score", score: res });
          });
        }
        break;
      default:
        break;
    }
  };

  async function runMlCheck(text) {
    if (!level.mlCheck || !level.mlCheck.endpoint) return null;
    try {
      const resp = await fetch(level.mlCheck.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const json = await resp.json();
      return json;
    } catch (e) {
      console.error("ML check error", e);
      return null;
    }
  }

  const showDialog = (title, message, type) => setDialog({ visible: true, title, message, type });

  const closeDialog = (goNext = false) => {
    const wasSuccess = dialog.type === "success";
    setDialog({ visible: false, title: "", message: "", type: "" });
    if (wasSuccess && level.nextLevel && goNext) {
      window.location.href = level.nextLevel;
    }
  };

  const handleAction = (actionId, meta = {}) => {
    const isCorrect = actionId === level.correctAction;
    recordAction(level.id, actionId, isCorrect, isCorrect ? (level.points || 10) : 0, meta);
    pushLog({ type: "user_action", actionId, meta, isCorrect });
    if (isCorrect) {
      showDialog("✅ Correct Choice", level.successMessage || "Good job — proceed to next level.", "success");
    } else {
      // special consequence for clicking active phish link
      if (actionId === "phish_link" && flags["phish_link"]) {
        showDialog("⚠️ Phish Link Clicked", "You clicked a malicious link during its active window (simulation).", "error");
      } else {
        showDialog("❌ Unsafe Choice", "That action was unsafe. Hints have been recorded. Every action counts.", "error");
      }
    }
  };

  const fmt = s => {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!level) return <div style={{ padding: 24, color: "#fff" }}>Level not found</div>;

  const contentNode = level.contentHtml ? <div dangerouslySetInnerHTML={{ __html: level.contentHtml }} /> : (level.content || null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center,#1e293b,#0f172a)", padding: 20 }}>
      <div style={{ width: 880, maxWidth: "98%", background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.35)", overflow: "hidden" }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src={avatar} alt="avatar" style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid #ddd" }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{level.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{level.category} • real-time</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", color: "#666" }}>
              <div style={{ fontSize: 12 }}>Time: {fmt(time)}</div>
              <div style={{ fontSize: 12 }}>Events: {eventsLog.length}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {flags.followupText && <div style={{ background: "#fff7ed", color: "#92400e", padding: 8, borderRadius: 6 }}>{flags.followupText}</div>}
            {flags.escalation && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 8, borderRadius: 6, marginTop: 8 }}>Escalation: Immediate action requested</div>}
          </div>

          <div style={{ marginTop: 12, color: "#222", lineHeight: 1.6 }}>
            {contentNode}

            {flags.mlScore && (
              <div style={{ marginTop: 10, padding: 8, borderRadius: 8, background: "#f3f4f6" }}>
                <strong>Model verdict:</strong> {flags.mlScore.prediction ?? "Unknown"} {flags.mlScore.score ? `(${Math.round(flags.mlScore.score*100)}%)` : ""}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {level.actions.map(a => {
              if (a.linkKey) {
                const active = !!flags[a.linkKey];
                return (
                  <button key={a.id} onClick={() => handleAction(a.id)} disabled={!active}
                    style={{
                      padding: "10px 14px", borderRadius: 8, border: "none",
                      cursor: active ? "pointer" : "not-allowed",
                      background: active ? "#0078d7" : "#e5e7eb",
                      color: active ? "#fff" : "#9ca3af"
                    }}>
                    {a.label}{!active ? ` (inactive)` : ""}
                  </button>
                );
              }
              return (
                <button key={a.id} onClick={() => handleAction(a.id)}
                  style={{
                    padding: "10px 14px", borderRadius: 8, border: "none",
                    cursor: "pointer",
                    background: a.style === "neutral" ? "#e6e6e6" : "#0078d7",
                    color: a.style === "neutral" ? "#111" : "#fff"
                  }}>
                  {a.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 12, color: "#666" }}>
            <div style={{ fontWeight: 700 }}>Hints / Indicators</div>
            <ul>
              {(level.hints || []).map((h, i) => (
                <li key={i} style={{ opacity: hintsUnlocked.includes(h) ? 1 : 0.5 }}>
                  {h} {hintsUnlocked.includes(h) ? null : <em style={{ fontSize: 12, color: "#9ca3af" }}> (hidden)</em>}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
              Timeline events recorded: {eventsLog.length}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#999" }}>© 2025 EnPhiSim — Every action counts</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => {
                setTime(0);
                setEventsLog([]);
                setFlags({});
                setHintsUnlocked([]);
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#111827", color: "#fff" }}>Replay</button>

              <button onClick={() => {
                if (level.mlCheck && level.mlCheck.enabled) {
                  runMlCheck(level.contentPlain || level.contentHtml).then(res => {
                    setFlags(f => ({ ...f, mlScore: res }));
                    pushLog({ type: "ml_manual", score: res });
                  });
                } else alert("ML check not enabled");
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff" }}>
                ML Check
              </button>
            </div>
          </div>
        </div>
      </div>

      {dialog.visible && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", padding: 18, borderRadius: 10, minWidth: 320 }}>
            <h3 style={{ margin: 0 }}>{dialog.title}</h3>
            <p style={{ color: "#333" }}>{dialog.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => closeDialog(false)} style={{ padding: "8px 10px", borderRadius: 8 }}>Close</button>
              {dialog.type === "success" && level.nextLevel && (
                <button onClick={() => closeDialog(true)} style={{ padding: "8px 10px", borderRadius: 8, background: "#0078d7", color: "#fff" }}>Next Level</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
