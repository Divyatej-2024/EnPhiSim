// src/context/ProgressContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

const ProgressContext = createContext();
export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("enphi-progress");
    return saved
      ? JSON.parse(saved)
      : {
          completedLevels: {},
          attempts: {},   // store actions here { levelId: [{correct: true|false}] }
        };
  });

  useEffect(() => {
    localStorage.setItem("enphi-progress", JSON.stringify(progress));
  }, [progress]);

  // Mark level completed
  const completeLevel = (levelId) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: {
        ...prev.completedLevels,
        [levelId]: true,
      },
    }));
  };

  // Record a user action (safe / risky click)
  const recordAction = (levelId, correct) => {
    setProgress(prev => ({
      ...prev,
      attempts: {
        ...prev.attempts,
        [levelId]: [
          ...(prev.attempts[levelId] || []),
          { correct },
        ],
      },
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLevel,
        recordAction,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
