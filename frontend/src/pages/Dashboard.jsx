// src/pages/Dashboard.jsx
// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import "../level-mail.css";
import "../level.css";
import "../components/BackgroundWrapper";
//import { levels } from "./levels/level_data";

const START_LINKS = [
  { label: "Easy", path: "/levels/easy/l1" },
  { label: "Advanced Easy", path: "/levels/adv_easy/l7" },
  { label: "Normal", path: "/levels/normal/l13" },
  { label: "Pre-Hard", path: "/levels/prehard/l19" },
  { label: "Hard", path: "/levels/hard/l24" },
  { label: "Advanced Hard", path: "/levels/adv_hard/l29" },
  { label: "Final", path: "/levels/final/l33" },
  { label: "Bonus", path: "/levels/bonus/bl1" }
];

export default function Dashboard() {
  const { actions } = useProgress();
  const storedActions = useMemo(() => {
    try {
      const raw = localStorage.getItem("enphisim_actions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }, []);

  const allActions = actions.length ? actions : storedActions;
  const total = allActions.length;
  const correct = allActions.filter(a => a.isCorrect).length;
  const points = allActions.reduce((s, a) => s + (a.points || 0), 0);

  function exportCSV() {
    const rows = allActions.map(a => ({
      timestamp: a.timestamp,
      levelId: a.levelId,
      optionId: a.optionId,
      isCorrect: a.isCorrect,
      points: a.points || 0
    }));
    if (!rows.length) return alert("No actions recorded.");
    const header = Object.keys(rows[0]);
    const csv = [header.join(","), ...rows.map(r => header.map(h => `"${String(r[h] ?? "").replace(/"/g,'""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `enphisim_actions_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#071033)", color: "#e6eef8", padding: 26 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1>EnPhiSim Dashboard</h1>
        <p>Select a category to start the real-time phishing simulations.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {START_LINKS.map(s => (
            <div key={s.label} style={{ background: "#071029", padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 700 }}>{s.label}</div>
              <div style={{ marginTop: 8 }}>
                <Link to={s.path}><button style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff" }}>Start</button></Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ background: "#06112a", padding: 12, borderRadius: 8 }}>
            <div>Total actions</div><div style={{ fontWeight: 700 }}>{total}</div>
          </div>
          <div style={{ background: "#06112a", padding: 12, borderRadius: 8 }}>
            <div>Correct</div><div style={{ fontWeight: 700 }}>{correct}</div>
          </div>
          <div style={{ background: "#06112a", padding: 12, borderRadius: 8 }}>
            <div>Points</div><div style={{ fontWeight: 700 }}>{points}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={exportCSV} style={{ padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "#fff" }}>Export CSV</button>
            <button onClick={() => { // eslint-disable-next-line no-restricted-globals
if (confirm("Clear all data?")) {
  localStorage.removeItem("enphisim_actions");
  window.location.reload();
}
 }} style={{ padding: "8px 12px", borderRadius: 8, background: "#ef4444", color: "#fff" }}>Clear</button>
          </div>
        </div>

        <div style={{ marginTop: 20, background: "#061024", padding: 12, borderRadius: 8 }}>
          <div style={{ color: "#9fb0c8", marginBottom: 8 }}>Recent (latest 10)</div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {allActions.slice(-10).reverse().map((a, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div>
                  <div><strong>{a.levelId}</strong> • {a.optionId}</div>
                  <div style={{ color: "#9fb0c8", fontSize: 12 }}>{new Date(a.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ alignSelf: "center", fontWeight: 700, color: a.isCorrect ? "#10b981" : "#ef4444" }}>{a.isCorrect ? "OK" : "X"}</div>
              </div>
            ))}
            {!allActions.length && <div style={{ color: "#9fb0c8" }}>No actions yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
