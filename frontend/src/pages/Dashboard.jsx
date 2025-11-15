import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data";

export default function Dashboard() {
  const { progress } = useProgress();
  const completed = Object.keys(progress.completedLevels).length;

  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      <h2>Total Actions Recorded: {progress.totalActions}</h2>
      <h3>Completed Levels: {completed} / {levels.length}</h3>

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
                <td>{isCompleted ? "✅ Completed" : "❌ Not Completed"}</td>
                <td>{attempts}</td>
                <td>
                  <Link className="start-btn" to={`/levels/${category}/${id}`}>
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
