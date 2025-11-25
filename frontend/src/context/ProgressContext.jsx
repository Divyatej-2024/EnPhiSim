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
          attempts: {}
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

const recordAction = (levelId, actionName, isCorrect) => {
  setProgress((prev) => {
    const newAction = { name: actionName, correct: isCorrect };
    return {
      ...prev,
      attempts: {
        ...prev.attempts,
        [levelId]: [...(prev.attempts[levelId] || []), newAction],
      },
    };
  });
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
