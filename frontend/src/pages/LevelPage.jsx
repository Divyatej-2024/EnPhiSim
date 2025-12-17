import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import TemplateRenderer from "./levels/TemplateRenderer";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLevels() {
      try {
        const data = await safeFetchJSON(
          `${process.env.REACT_APP_API_URL}/api/levels`
        );
        setLevels(data);
      } catch (err) {
        console.error("Failed to load levels:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, []);

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading) return <h2>Loading level…</h2>;
  if (error) return <h2>Failed to load level</h2>;

  const level = levels.find(
    (l) =>
      l.category?.toLowerCase().trim() === category?.toLowerCase().trim() &&
      l.Level_no?.toLowerCase().trim() === levelId?.toLowerCase().trim()
  );

  if (!level) return <h2>Level not found</h2>;

  const options = [
    { key: "correct", label: level.correct_option, correct: true },
    { key: "neutral", label: level.neutral_option, correct: false },
    { key: "wrong", label: level.wrong_option, correct: false },
  ];

  const handleOptionClick = (option) => {
    recordAction(level.Level_no, option.key);

    if (option.correct) {
      markLevelComplete(level.Level_no);
      navigate("/dashboard");
    } else {
      alert("Incorrect! Try again.");
    }
  };

  /* ✅ Create new object (NO mutation) */
  const levelWithOptions = {
    ...level,
    options,
  };

  return (
    <TemplateRenderer
      level={levelWithOptions}
      onOptionClick={handleOptionClick}
    />
  );
}
