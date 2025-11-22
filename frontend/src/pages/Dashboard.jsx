import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data";
import "./dashboard.css";

export default function Dashboard() {
  const { progress } = useProgress();

  // ---------------------------
  // 1. BASIC COUNTS
  // ---------------------------
  const completed = Object.keys(progress.completedLevels).length;
  const totalLevels = levels.length;

  // ---------------------------
  // 2. ACTION-BASED ANALYTICS
  // ---------------------------

  // Total actions (already tracked)
  const totalActions = progress.totalActions || 0;

  // Categorizing actions
  const actions = progress.actions || [];

  const riskyActions = actions.filter(a =>
    a.type === "clicked_link" ||
    a.type === "opened_attachment" ||
    a.type === "ignored_phishing"
  ).length;

  const safeActions = actions.filter(a =>
    a.type === "reported_phishing" ||
    a.type === "avoided_click" ||
    a.type === "marked_phishing"
  ).length;

  // Accuracy = correct actions / total actions
  const correctActions = actions.filter(a => a.correct).length;
  const accuracy =
    totalActions > 0 ? ((correctActions / totalActions) * 100).toFixed(1) : 0;

  // Completion Rate
  const completionRate = ((completed / totalLevels) * 100).toFixed(1);

  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      {/* =======================
          SUMMARY ANALYTICS
      ======================== */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Actions</h3>
          <p>{totalActions}</p>
        </div>

        <div className="card">
          <h3>Completed Levels</h3>
          <p>{completed} / {totalLevels}</p>
        </div>

        <div className="card">
          <h3>Completion Rate</h3>
          <p>{completionRate}%</p>
        </div>

        <div className="card">
          <h3>Safe Actions</h3>
          <p>{safeActions}</p>
        </div>

        <div className="card red">
          <h3>Risky Actions</h3>
          <p>{riskyActions}</p>
        </div>

        <div className="card blue">
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>
      </div>

      {/* =======================
          LEVEL TABLE
      ======================== */}
      <table className="progress-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Attempts</th>
            <th>Start</th>
          </tr>
        </thead>

        <tbody>
          {levels.map((lvl) => {
            const { id, page_title, category = "unknown" } = lvl;
            const isCompleted = progress.completedLevels[id];
            const attempts = progress.attempts[id]?.length || 0;

            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{page_title}</td>
                <td className={`cat ${category}`}>{category.toUpperCase()}</td>

                <td>
                  {isCompleted
                    ? "Completed successfully"
                    : "Not Completed unfortunately"}
                </td>

                <td>{attempts}</td>

                <td>
                  <Link
                    className="start-btn"
                    to={`/levels/${category}/${lvl.Level_no}`}
                  >
                    {isCompleted ? "Review" : "Start"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
