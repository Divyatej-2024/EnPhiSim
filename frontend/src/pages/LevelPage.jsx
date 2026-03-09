import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { normalizeLevelData } from "../utils/LevelHelper";
import TemplateRenderer from "./levels/TemplateRenderer";
import { BACKEND_URL_CANDIDATES } from "../services/api";
import { useProgress } from "../context/ProgressContext";

export default function LevelPage() {
  const { category, level_no } = useParams();
  const { getLevelScenario } = useProgress();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!category || !level_no) {
      setError("Invalid level URL");
      setLoading(false);
      return;
    }

    async function loadLevel() {
      try {
        let loaded = null;
        let scenarioDoc = null;
        let lastError = null;

        for (const apiUrl of BACKEND_URL_CANDIDATES) {
          try {
            loaded = await safeFetchJSON(`${apiUrl}/api/levels/${category}/${level_no}`);

            try {
              scenarioDoc = await safeFetchJSON(`${apiUrl}/api/scenarios/${category}/${level_no}`);
            } catch (scenarioErr) {
              // Scenario data is optional per level.
              scenarioDoc = null;
            }

            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (!loaded) throw lastError || new Error("Failed to load level");

        if (isMounted) {
          const normalized = normalizeLevelData(loaded);
          const scenarios = Array.isArray(scenarioDoc?.scenarios) ? scenarioDoc.scenarios : [];
          const scenarioKey = `${category}:${level_no}`;
          const chosenScenario =
            scenarios.length > 0 ? getLevelScenario(scenarioKey, scenarios) : null;

          setLevel({
            ...normalized,
            ...(chosenScenario || {}),
            scenario_pool: scenarios,
          });
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load level:", err);
        setError(err.message || "Failed to load level");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLevel();
    return () => {
      isMounted = false;
    };
  }, [category, level_no, getLevelScenario]);

  if (loading) return <h2>Loading level...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!level) return <h2>Level not found</h2>;

  return <TemplateRenderer level={level} />;
}
