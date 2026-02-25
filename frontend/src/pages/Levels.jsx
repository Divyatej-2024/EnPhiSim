import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LevelsPage() {
  const navigate = useNavigate();

  // ⚠️ DO NOT change variable name
  const API_URL =
  process.env.REACT_APP_API_URL || "https://enphisim-1.onrender.com";

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API_URL) {
      setError("API URL not set");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/levels`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch levels");
        return res.json();
      })
      .then((data) => {
        setLevels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load levels from server");
        setLoading(false);
      });
  }, [API_URL]);

  // Group levels by category
  const groupedLevels = levels.reduce((acc, level) => {
    const category = level.category || "uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(level);
    return acc;
  }, {});

  if (loading) return <div className="status">Loading levels...</div>;
  if (error) return <div className="status error">{error}</div>;

  return (
    <div className="levels-container">
      <h1 className="title">Phishing Simulation Levels</h1>

      {Object.keys(groupedLevels).map((category) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category.toUpperCase()}</h2>

          <div className="levels-grid">
            {groupedLevels[category].map((level) => (
              <div
                key={level.id}
                className="level-card"
                onClick={() => navigate("/levels/" + (level.category || category || "easy").toLowerCase() + "/" + (level.Level_no || level.level_no))}>
                <h3>{level.page_title}</h3>
                <p className="hint">{level.Hint}</p>
                <span className="email">{level.phish_email}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Embedded CSS */}
      <style>{`
        .levels-container {
          padding: 30px;
          color: #fff;
          background: #0d1117;
          min-height: 100vh;
        }

        .title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          color: #58a6ff;
        }

        .category-section {
          margin-bottom: 40px;
        }

        .category-title {
          margin-bottom: 15px;
          border-left: 4px solid #58a6ff;
          padding-left: 10px;
          color: #c9d1d9;
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .level-card {
          background: #161b22;
          border: 1px solid #30363d;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .level-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 15px rgba(88,166,255,0.4);
        }

        .level-card h3 {
          margin: 0 0 10px;
          color: #58a6ff;
        }

        .hint {
          font-size: 0.9rem;
          color: #8b949e;
          margin-bottom: 8px;
        }

        .email {
          font-size: 0.8rem;
          color: #f85149;
          word-break: break-all;
        }

        .status {
          padding: 40px;
          text-align: center;
          color: #c9d1d9;
        }

        .status.error {
          color: #f85149;
        }
      `}</style>
    </div>
  );
}
