// frontend/src/context/ProgressContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const ProgressContext = createContext();

const TOTAL_LEVELS = 39; // ✅ FIXED TOTAL

export function ProgressProvider({ children }) {

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

  useEffect(() => {
    localStorage.setItem("enphisim-progress", JSON.stringify(progress));
  }, [progress]);

  // ==============================
  // ACTION RECORDING
  // ==============================

  const recordAction = (levelId, actionType, isCorrect) => {
    setProgress(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          levelId,
          actionType,
          isCorrect, // true / false
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  // ==============================
  // MARK LEVEL COMPLETE
  // ==============================

  const markLevelComplete = (levelId) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: {
        ...prev.completedLevels,
        [levelId]: true
      },
      xp: prev.xp + 100
    }));
  };

  // ==============================
  // DERIVED METRICS
  // ==============================

  const completedCount = Object.keys(progress.completedLevels).length;

  const completionRate =
    TOTAL_LEVELS === 0
      ? 0
      : ((completedCount / TOTAL_LEVELS) * 100).toFixed(1);

  const totalActions = progress.actions.length;

  const correctActions = progress.actions.filter(a => a.isCorrect).length;

  const accuracy =
    totalActions === 0
      ? 0
      : ((correctActions / totalActions) * 100).toFixed(1);

  const safeActions = progress.actions.filter(a => a.isCorrect).length;
  const riskActions = progress.actions.filter(a => !a.isCorrect).length;

  const isFinalUnlocked =
    completionRate >= 75 && accuracy >= 75;

  return (
    <ProgressContext.Provider
      value={{
        progress,
        recordAction,
        markLevelComplete,
        TOTAL_LEVELS,
        completedCount,
        completionRate,
        totalActions,
        accuracy,
        safeActions,
        riskActions,
        isFinalUnlocked
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);