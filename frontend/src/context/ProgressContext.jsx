// src/context/ProgressContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem("enphisim_progress");
      return raw ? JSON.parse(raw) : { completed: {}, actions: {}, totalPoints: 0 };
    } catch (e) {
      return { completed: {}, actions: {}, totalPoints: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem("enphisim_progress", JSON.stringify(progress));
  }, [progress]);

  const recordAction = (levelId, actionId, isCorrect, points = 0) => {
    setProgress(prev => {
      const actionsForLevel = prev.actions[levelId] ? [...prev.actions[levelId]] : [];
      const timestamp = new Date().toISOString();
      actionsForLevel.push({ actionId, isCorrect, points, timestamp });
      // award points for this correct action
      const totalPoints = prev.totalPoints + (isCorrect ? points : 0);
      const completed = { ...prev.completed };
      if (isCorrect) {
        completed[levelId] = { completedAt: timestamp, pointsAwarded: (completed[levelId]?.pointsAwarded || 0) + points };
      }
      return { ...prev, actions: { ...prev.actions, [levelId]: actionsForLevel }, completed, totalPoints };
    });
  };

  const resetProgress = () => {
    setProgress({ completed: {}, actions: {}, totalPoints: 0 });
  };

  return (
    <ProgressContext.Provider value={{ progress, recordAction, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}
