import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { normalizeLevelData } from "../utils/LevelHelper";
import TemplateRenderer from "./levels/TemplateRenderer";
import { BACKEND_URL_CANDIDATES } from "../api";

export default function LevelPage() {
  const { category, level_no } = useParams();
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
        let lastError = null;

        for (const apiUrl of BACKEND_URL_CANDIDATES) {
          try {
            loaded = await safeFetchJSON(`${apiUrl}/api/levels/${category}/${level_no}`);
            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (!loaded) throw lastError || new Error("Failed to load level");

        if (isMounted) {
          setLevel(normalizeLevelData(loaded));
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
  }, [category, level_no]);

  if (loading) return <h2>Loading level...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!level) return <h2>Level not found</h2>;

  return <TemplateRenderer level={level} />;
}
