import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LevelList() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/levels")
      .then((res) => res.json())
      .then((data) => {
        setLevels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching levels:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading levels...</p>;

  return (
    <div className="level-list">
      <h2>Available Levels</h2>

      <ul>
        {levels.map((level) => (
          <li key={level._id} className="level-item">
            <Link to={`/levels/${level._id}`}>
              <strong>{level.page_title || "Untitled Level"}</strong>
            </Link>

            <p>
              {level.level_text
                ? level.level_text.slice(0, 90) + "..."
                : "No preview available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LevelList;
