// frontend/src/context/ProgressContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

export const ProgressContext = createContext();

/*
  Curriculum Structure
  Total = 39 Levels
*/

const LEVEL_CONFIG = {
  EASY: 6,
  ADV_EASY: 6,
  NORMAL: 6,
  PRE_HARD: 5,
  HARD: 5,
  ADV_HARD: 4,
  BONUS: 6,
  FINAL: 1
};

const TOTAL_LEVELS = Object.values(LEVEL_CONFIG)
  .reduce((a, b) => a + b, 0);

export function ProgressProvider({ children }) {

  // ==============================
  // INITIAL STATE (SAFE LOAD)
  // ==============================

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("enphisim-progress");

      if (!saved) {
        return {
          completedLevels: {},
          actions: [],
          xp: 0
        };
      }

      return JSON.parse(saved);

    } catch (error) {
      console.error("Failed to parse progress:", error);

      return {
        completedLevels: {},
        actions: [],
        xp: 0
      };
    }
  });

  // ==============================
  // AUTO SAVE
  // ==============================

  useEffect(() => {
    try {
      localStorage.setItem("enphisim-progress", JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [progress]);

  // ==============================
  // RECORD USER ACTION
  // ==============================

  const recordAction = (levelId, actionType, isCorrect) => {
    setProgress(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          levelId,
          actionType,
          isCorrect,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  // ==============================
  // MARK LEVEL COMPLETE
  // ==============================

  const markLevelComplete = (levelId) => {
    setProgress(prev => {

      // Prevent duplicate XP if already completed
      if (prev.completedLevels[levelId]) {
        return prev;
      }

      return {
        ...prev,
        completedLevels: {
          ...prev.completedLevels,
          [levelId]: true
        },
        xp: prev.xp + 100
      };
    });
  };

  // ==============================
  // DERIVED METRICS
  // ==============================

  const completedCount =
    Object.keys(progress.completedLevels).length;

  const completionRate =
    TOTAL_LEVELS === 0
      ? 0
      : Math.round((completedCount / TOTAL_LEVELS) * 100);

  const totalActions = progress.actions.length;

  const correctActions =
    progress.actions.filter(a => a.isCorrect).length;

  const accuracy =
    totalActions === 0
      ? 0
      : Math.round((correctActions / totalActions) * 100);

  const safeActions = correctActions;

  const riskActions =
    progress.actions.filter(a => !a.isCorrect).length;

  // ==============================
  // CATEGORY STATS
  // ==============================

  const getCategoryStats = (category) => {

    const total = LEVEL_CONFIG[category];

    if (!total) {
      return { completed: 0, total: 0, percent: 0 };
    }

    const prefix = category.toLowerCase().replace("_", "");

    const completed =
      Object.keys(progress.completedLevels)
        .filter(id =>
          id.toLowerCase().startsWith(prefix)
        ).length;

    const percent =
      total === 0
        ? 0
        : Math.round((completed / total) * 100);

    return { completed, total, percent };
  };

  // ==============================
  // UNLOCK LOGIC
  // ==============================

  const isFinalUnlocked =
    completionRate >= 75 && accuracy >= 75;

  // ==============================
  // RESET FUNCTION (Optional)
  // ==============================

  const resetProgress = () => {
    localStorage.removeItem("enphisim-progress");
    setProgress({
      completedLevels: {},
      actions: [],
      xp: 0
    });
  };

  // ==============================
  // PROVIDER
  // ==============================

  return (
    <ProgressContext.Provider
      value={{
        progress,
        recordAction,
        markLevelComplete,
        resetProgress,
        LEVEL_CONFIG,
        TOTAL_LEVELS,
        completedCount,
        completionRate,
        totalActions,
        accuracy,
        safeActions,
        riskActions,
        isFinalUnlocked,
        getCategoryStats
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);