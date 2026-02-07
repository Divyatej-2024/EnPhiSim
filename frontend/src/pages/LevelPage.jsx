// frontend/src/pages/LevelPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import { normalizeLevelData } from "../utils/LevelHelper"; // Add import
import TemplateRenderer from "./levels/TemplateRenderer";

export default function LevelPage() {
  const { category, level_no } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category || !level_no) {
      setError("Invalid level URL");
      setLoading(false);
      return;
    }

    async function loadLevel() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://enphisim-1.onrender.com";
        if (!apiUrl) throw new Error("API URL not set");

        const data = await safeFetchJSON(`${apiUrl}/api/levels`);
        const levelArray = Array.isArray(data) ? data : data.levels || [];
        
        // Normalize all levels first
        const normalizedLevels = levelArray.map(normalizeLevelData);
        
        // Find using consistent field name
        const foundLevel = normalizedLevels.find(
          (l) =>
            l.category?.toLowerCase().trim() === category.toLowerCase().trim() &&
            l.level_no?.toLowerCase().trim() === level_no.toLowerCase().trim()
        );

        if (!foundLevel) {
          setError(`Level ${level_no} in category ${category} not found`);
        } else {
          setLevel(foundLevel);
        }
      } catch (err) {
        console.error("Failed to load level:", err);
        setError(err.message || "Failed to load level");
      } finally {
        setLoading(false);
      }
    }

    loadLevel();
  }, [category, level_no]);

  if (loading) return <h2>Loading level…</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!level) return <h2>Level not found</h2>;

  // Prepare options
  const options = [
    { key: "correct", label: level.correct_option, correct: true },
    { key: "neutral", label: level.neutral_option, correct: false },
    { key: "wrong", label: level.wrong_option, correct: false },
  ].filter(opt => opt.label); // Filter out undefined options

  const handleOptionClick = (option) => {
    // Use consistent level_no field
    recordAction(level.level_no, option.key);

    if (option.correct) {
      markLevelComplete(level.level_no);
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