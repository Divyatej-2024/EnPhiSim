// src/shared/LevelTemplate.jsx
import React, { useState, useEffect,useRef } from "react";
import { useProgress } from "../context/ProgressContext";
import avatar from "../pages/levels/img/avtar.png"; // place avtar.png in src/pages/levels/img/

/*
Level object shape (example):
{
  id: "I1",
  title: "...",
  category: "easy",
  contentHtml: "<p>...</p>",
  events: [
    { t: 0, type: "arrive_email", data: {...} },
    { t: 6, type: "followup", data: {...} },
    { t: 12, type: "activate_link", data: { key: "phish_link", duration: 20 } },
    { t: 25, type: "lockout", data: {...} }
  ],
  actions: [ { id: "verify", label: "Verify Now" }, ... ],
  correctAction: "unsubscribe",
  mlCheck: { enabled: true, endpoint: "/api/predict" } // optional
}
*/

export default function LevelTemplateRealtime({ level }) {
  const { recordAction } = useProgress();
  const [dialog, setDialog] = useState({ visible: false, title: "", message: "", type: "" });
  const [eventsLog, setEventsLog] = useState([]); // timeline for replay
  const [activeFlags, setActiveFlags] = useState({}); // named flags such as linkActive:true
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUnlocked, setHintsUnlocked] = useState([]);
  const [mlScore, setMlScore] = useState(null);
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  // Start the realtime timeline on mount
  useEffect(() => {
    if (!level || !level.events) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // tick every second
    timerRef.current = setInterval(() => {
      setTimeElapsed(t => t + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [level]);

  // watch timeline
  useEffect(() => {
    if (!level || !level.events) return;

    // for each event whose time == timeElapsed, trigger it
    const toTrigger = level.events.filter(ev => ev.t === timeElapsed);
    toTrigger.forEach(ev => handleEvent(ev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeElapsed, level]);

  const pushLog = (entry) => {
    setEventsLog(prev => [...prev, { time: timeElapsed, ...entry }]);
  };

  const handleEvent = (ev) => {
    pushLog({ type: ev.type, data: ev.data || {} });

    switch (ev.type) {
      case "arrive_email":
        // make the email visible (already is) — maybe highlight
        setActiveFlags(f => ({ ...f, emailArrived: true }));
        break;

      case "followup":
        // show a follow-up banner
        setActiveFlags(f => ({ ...f, followup: ev.data.text || true }));
        // optional: auto-unlock a hint after followup
        if (ev.data.unlockHint) {
          setTimeout(() => {
            setHintsUnlocked(h => Array.from(new Set([...h, ev.data.unlockHint])));
          }, 1000);
        }
        break;

      case "activate_link":
        // set a named link active for duration seconds
        setActiveFlags(f => ({ ...f, [ev.data.key]: true }));
        // schedule deactivation
        setTimeout(() => {
          setActiveFlags(f => ({ ...f, [ev.data.key]: false }));
          pushLog({ type: "deactivate_link", key: ev.data.key });
        }, (ev.data.duration || 10) * 1000);
        break;

      case "unlock_hint":
        setHintsUnlocked(h => Array.from(new Set([...h, ev.data.hint])));
        break;

      case "ml_check":
        if (ev.data && level.mlCheck && level.mlCheck.enabled) {
          runMlCheck(level.contentPlain || level.contentHtml).then(res => {
            setMlScore(res);
            pushLog({ type: "ml_score", score: res });
          }).catch(err => {
            pushLog({ type: "ml_error", error: String(err) });
          });
        }
        break;

      case "escalation":
        // show urgent banner / update UI
        setActiveFlags(f => ({ ...f, escalation: ev.data || true }));
        break;

      default:
        // custom events
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
      // expected shape: { prediction: "Phishing"|"Legit", score: 0.87 }
      return json;
    } catch (e) {
      console.error("ML check failed", e);
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
    recordAction(level.id, actionId, isCorrect, isCorrect ? (level.points || 10) : 0);
    pushLog({ type: "user_action", actionId, meta, isCorrect });

    if (isCorrect) {
      showDialog("✅ Correct Choice!", level.successMessage || "Good — proceed when ready.", "success");
    } else {
      // If action is clicking an active phishing link, show special consequence
      if (actionId === "phish_link" && activeFlags["phish_link"]) {
        showDialog("⚠️ Phish Clicked", "You clicked a malicious link while it was active. Your credentials may be compromised (simulation).", "error");
      } else {
        showDialog("❌ Unsafe Choice", "That action was unsafe or suboptimal. Every action counts — review the hints.", "error");
      }
    }
  };

  // Helper to format seconds -> mm:ss
  const fmt = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!level) return <div style={{ padding: 40, color: "#fff" }}>Level data missing</div>;

  // content may be HTML string or JSX
  const contentNode = level.contentHtml ? <div dangerouslySetInnerHTML={{ __html: level.contentHtml }} /> : (level.content || null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at center,#1e293b,#0f172a)", padding: 20, fontFamily: "'Segoe UI', Tahoma" }}>
      <div style={{ width: 840, maxWidth: "95%", background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.4)", overflow: "hidden" }}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #ddd" }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{level.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{level.category} • real-time simulation</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", color: "#666" }}>
              <div style={{ fontSize: 12 }}>Time: {fmt(timeElapsed)}</div>
              <div style={{ fontSize: 12 }}>Events: {eventsLog.length}</div>
            </div>
          </div>

          {/* optional active banners */}
          <div style={{ marginTop: 12 }}>
            {activeFlags.followup && <div style={{ background: "#fff7ed", color: "#92400e", padding: 8, borderRadius: 6, marginBottom: 8 }}>{activeFlags.followup}</div>}
            {activeFlags.escalation && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 8, borderRadius: 6, marginBottom: 8 }}>Escalation: Immediate Action Requested</div>}
          </div>

          <div style={{ marginTop: 12, color: "#222", lineHeight: 1.6 }}>
            {contentNode}

            {/* show ML score if available */}
            {mlScore && (
              <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: "#f3f4f6", color: "#111" }}>
                <strong>Model verdict:</strong> {mlScore.prediction || "Unknown"} {mlScore.score ? `(${Math.round(mlScore.score*100)}%)` : ""}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            {level.actions.map(a => {
              // if action is a link keyed to a realtime flag, disable unless active
              if (a.linkKey) {
                const isActive = !!activeFlags[a.linkKey];
                return (
                  <button key={a.id} onClick={() => handleAction(a.id)} disabled={!isActive}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      cursor: isActive ? "pointer" : "not-allowed",
                      background: isActive ? "#0078d7" : "#e5e7eb",
                      color: isActive ? "#fff" : "#9ca3af"
                    }}>
                    {a.label}{!isActive ? ` (inactive ${a.linkKey})` : ""}
                  </button>
                );
              }

              // regular action
              return (
                <button key={a.id} onClick={() => handleAction(a.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: a.style === "neutral" ? "#e6e6e6" : "#0078d7",
                    color: a.style === "neutral" ? "#111" : "#fff"
                  }}>
                  {a.label}
                </button>
              );
            })}
          </div>

          {/* hints area (unlocks based on events or time) */}
          <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 12, color: "#666" }}>
            <div style={{ fontWeight: 700 }}>Hints / Indicators</div>
            <ul>
              {(level.hints || []).map((h, i) => (
                <li key={i} style={{ opacity: hintsUnlocked.includes(h) ? 1 : 0.45 }}>
                  {h} {hintsUnlocked.includes(h) ? null : <em style={{ fontSize: 12, color: "#9ca3af" }}> (hidden)</em>}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
              Timeline events: {eventsLog.length} • last event at {eventsLog.length ? `${eventsLog[eventsLog.length-1].time}s` : "—"}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#999" }}>© 2025 EnPhiSim — Every action counts</div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => {
                // replay timeline from start (reset)
                setTimeElapsed(0);
                setEventsLog([]);
                setActiveFlags({});
                setHintsUnlocked([]);
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#0b1220", color: "#fff" }}>Replay</button>

              <button onClick={() => {
                // quick ML re-check if enabled
                if (level.mlCheck && level.mlCheck.enabled) {
                  runMlCheck(level.contentPlain || level.contentHtml).then(res => {
                    setMlScore(res);
                    pushLog({ type: "ml_manual", score: res });
                  });
                } else alert("ML check not enabled for this level.");
              }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff" }}>
                ML Check
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* dialog */}
      {dialog.visible && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, minWidth: 320 }}>
            <h3 style={{ margin: 0 }}>{dialog.title}</h3>
            <p style={{ color: "#444" }}>{dialog.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => closeDialog(false)} style={{ padding: "8px 12px", borderRadius: 8 }}>Close</button>
              {dialog.type === "success" && level.nextLevel && (
                <button onClick={() => closeDialog(true)} style={{ padding: "8px 12px", borderRadius: 8, background: "#0078d7", color: "#fff" }}>Next Level</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
