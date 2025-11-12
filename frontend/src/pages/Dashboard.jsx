// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import "../level-mail.css";
import "../level.css";
import "../components/BackgroundWrapper";

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

  // progress ratio
  const totalLevels = 40; // you can update to your real total
  const progressPercent = Math.min((correct / totalLevels) * 100, 100);

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
    const csv = [header.join(","), ...rows.map(r =>
      header.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enphisim_actions_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#e6eef8",
      background: "radial-gradient(circle at top, #071029, #020617)",
      padding: 24
    }}>
      <h1 style={{ marginBottom: 12, textAlign: "center" }}>EnPhiSim Dashboard</h1>
      <p style={{ color: "#9fb0c8", marginBottom: 40, textAlign: "center" }}>
        Begin your phishing simulation journey.
      </p>

      {/* Circle progress container */}
      <div style={{
        position: "relative",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: `conic-gradient(#2563eb ${progressPercent}%, #0a1b3f ${progressPercent}% 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 25px rgba(37,99,235,0.3)"
      }}>
        <div style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "#071029",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#e6eef8"
        }}>
          <div style={{ fontSize: 14, color: "#9fb0c8" }}>Progress</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(progressPercent)}%</div>
        </div>
      </div>

      {/* Start Button */}
      <div style={{ marginTop: 30 }}>
        <Link to="/levels/easy/l1">
          <button style={{
            padding: "14px 26px",
            borderRadius: 50,
            fontSize: 18,
            fontWeight: 700,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(37,99,235,0.5)",
            transition: "transform 0.2s ease"
          }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1.0)"}
          >
            Start Simulation
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        marginTop: 40,
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ background: "#06112a", padding: 12, borderRadius: 8, minWidth: 120, textAlign: "center" }}>
          <div>Total</div><div style={{ fontWeight: 700 }}>{total}</div>
        </div>
        <div style={{ background: "#06112a", padding: 12, borderRadius: 8, minWidth: 120, textAlign: "center" }}>
          <div>Correct</div><div style={{ fontWeight: 700, color: "#10b981" }}>{correct}</div>
        </div>
        <div style={{ background: "#06112a", padding: 12, borderRadius: 8, minWidth: 120, textAlign: "center" }}>
          <div>Points</div><div style={{ fontWeight: 700, color: "#facc15" }}>{points}</div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
        <button
          onClick={exportCSV}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "#10b981",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Export CSV
        </button>
        <button
          onClick={() => {
            if (window.confirm("Clear all data?")) {
              localStorage.removeItem("enphisim_actions");
              window.location.reload();
            }
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}
