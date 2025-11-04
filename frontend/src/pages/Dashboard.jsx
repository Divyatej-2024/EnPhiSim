// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import levels from "../levels/level_data.json";
import { useProgress } from "../context/ProgressContext";

const categories = ["easy", "adv_easy", "normal", "pre_hard", "hard", "adv_hard", "final"];

export default function Dashboard(){
  const { progress } = useProgress();
  const totalPoints = progress.totalPoints || 0;

  const firstInCategory = (cat) => levels.find(l => l.category === cat);

  return (
    <div style={{ minHeight: "100vh", padding: 30, background: "linear-gradient(to bottom right,#0f172a,#1e293b)", color: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28 }}>EnPhiSim Dashboard</h1>
        <p style={{ color: "#cbd5e1" }}>Every action counts — your total: {totalPoints} points</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 18 }}>
          {categories.map(cat => {
            const entry = firstInCategory(cat);
            if(!entry) return null;
            return (
              <div key={cat} style={{ background: "#111827", padding: 16, borderRadius: 12 }}>
                <h3 style={{ marginTop: 0, textTransform: "capitalize" }}>{cat.replace("_"," ")}</h3>
                <p style={{ color: "#9ca3af" }}>{entry.title}</p>
                <Link to={`/levels/${entry.id}`}>
                  <button style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "#0ea5a4", border: "none", color: "#fff" }}>
                    Start {entry.id}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28 }}>
          <h4 style={{ color: "#cbd5e1" }}>Quick Stats</h4>
          <p style={{ color: "#94a3b8" }}>Total Actions recorded: {Object.values(progress.actions || {}).flat().length || 0}</p>
        </div>
      </div>
    </div>
  );
}
