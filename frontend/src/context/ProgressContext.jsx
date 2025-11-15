import React, { createContext, useContext, useEffect, useState } from "react";

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("enphisim_progress");
    return saved
      ? JSON.parse(saved)
      : {
          completedLevels: {},
          attempts: {},
          totalActions: 0
        };
  });

  // Save to localStorage whenever progress updates
  useEffect(() => {
    localStorage.setItem("enphisim_progress", JSON.stringify(progress));
  }, [progress]);

  const markLevelComplete = (levelId) => {
    setProgress((prev) => ({
      ...prev,
      completedLevels: {
        ...prev.completedLevels,
        [levelId]: true,
      },
    }));
  };

  const recordAction = (levelId, actionName) => {
    setProgress((prev) => ({
      ...prev,
      totalActions: prev.totalActions + 1,
      attempts: {
        ...prev.attempts,
        [levelId]: [...(prev.attempts[levelId] || []), actionName],
      },
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markLevelComplete,
        recordAction,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
