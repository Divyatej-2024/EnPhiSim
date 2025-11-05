// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "./context/ProgressContext";

/*
  Adjust these links if you used different paths. These match the structure we agreed:
  /levels/easy/I1
  /levels/adv_easy/I7
  /levels/normal/I13
  /levels/pre_hard/I19
  /levels/hard/I24
  /levels/adv_hard/I29
  /levels/final/F
*/

const CATEGORIES = [
  { key: "easy", label: "Easy", path: "/levels/easy/I1" },
  { key: "adv_easy", label: "Advanced Easy", path: "/levels/adv_easy/I7" },
  { key: "normal", label: "Normal", path: "/levels/normal/I13" },
  { key: "prehard", label: "Pre-Hard", path: "/levels/pre_hard/I19" },
  { key: "hard", label: "Hard", path: "/levels/hard/I24" },
  { key: "adv_hard", label: "Advanced Hard", path: "/levels/adv_hard/I29" },
  { key: "final", label: "Final", path: "/levels/final/F" },
];

export default function Dashboard() {
  const { actions } = useProgress();

  // prefer context actions; fallback to localStorage (if the page was refreshed)
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
  const incorrect = total - correct;
  const points = allActions.reduce((s, a) => s + (a.points || 0), 0);

  function downloadCSV() {
    const rows = allActions.map(a => ({
      timestamp: a.timestamp,
      levelId: a.levelId,
      optionId: a.optionId,
      isCorrect: a.isCorrect,
      points: a.points || 0
    }));

    if (!rows.length) {
      alert("No actions to export.");
      return;
    }

    const header = Object.keys(rows[0]);
    const csv = [
      header.join(","),
      ...rows.map(r => header.map(h => {
        const v = String(r[h] ?? "");
        // escape quotes and commas
        return `"${v.replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enphisim_actions_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#0f172a,#111827)",
      color: "#e6eef8",
      padding: 28,
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 6 }}>EnPhiSim — Dashboard</h1>
        <p style={{ color: "#9fb0c8" }}>Select a category to start. Export recorded actions for grading or analysis.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 18 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ background: "#0b1220", padding: 14, borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{cat.label}</div>
              <div style={{ marginTop: 8 }}>
                <Link to={cat.path}>
                  <button style={{
                    padding: "8px 12px", borderRadius: 8, border: "none",
                    background: "#2563eb", color: "#fff", cursor: "pointer"
                  }}>
                    Start {cat.label}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ background: "#071028", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: "#9fb0c8" }}>Total actions</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{total}</div>
          </div>

          <div style={{ background: "#071028", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: "#9fb0c8" }}>Correct</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{correct}</div>
          </div>

          <div style={{ background: "#071028", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: "#9fb0c8" }}>Incorrect</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{incorrect}</div>
          </div>

          <div style={{ background: "#071028", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: "#9fb0c8" }}>Points</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{points}</div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={downloadCSV} style={{
              padding: "8px 12px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer"
            }}>
              Export progress (CSV)
            </button>
            <button onClick={() => {
              if (confirm("Clear recorded actions from localStorage? This cannot be undone.")) {
                localStorage.removeItem("enphisim_actions");
                window.location.reload();
              }
            }} style={{
              padding: "8px 12px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer"
            }}>
              Clear data
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, background: "#061024", padding: 12, borderRadius: 8 }}>
          <div style={{ color: "#9fb0c8", marginBottom: 8 }}>Recent actions (latest 10)</div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {allActions.slice(-10).reverse().map((a, idx) => (
              <div key={idx} style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 13 }}>
                  <div><strong>{a.levelId}</strong> • {a.optionId}</div>
                  <div style={{ color: "#9fb0c8", fontSize: 12 }}>{new Date(a.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ alignSelf: "center", fontWeight: 700, color: a.isCorrect ? "#10b981" : "#ef4444" }}>
                  {a.isCorrect ? "OK" : "X"}
                </div>
              </div>
            ))}
            {!allActions.length && <div style={{ color: "#9fb0c8" }}>No actions recorded yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
