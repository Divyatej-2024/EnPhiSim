import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import TemplateRenderer from "./levels/TemplateRenderer";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Defensive check for missing params
    if (!category || !levelId) {
      setError("Invalid level URL");
      setLoading(false);
      return;
    }

    async function loadLevel() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) throw new Error("API URL not set");

        // Option 1: Fetch all levels and find the one we need
        const data = await safeFetchJSON(`${apiUrl}/api/levels`);

        const foundLevel = data.find(
          (l) =>
            l.category?.toLowerCase().trim() === category.toLowerCase().trim() &&
            l.Level_no?.toLowerCase().trim() === levelId.toLowerCase().trim()
        );

        if (!foundLevel) {
          setError("Level not found");
        } else {
          setLevel(foundLevel);
        }
      } catch (err) {
        console.error("Failed to load level:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLevel();
  }, [category, levelId]);

  // ---------------- LOADING / ERROR ----------------
  if (loading) return <h2>Loading level…</h2>;
  if (error) return <h2>{error}</h2>;
  if (!level) return null; // Level not found handled above

  // Prepare options
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

  const levelWithOptions = { ...level, options };

  return (
    <TemplateRenderer
      level={levelWithOptions}
      onOptionClick={handleOptionClick}
    />
  );
}
