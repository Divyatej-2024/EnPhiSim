// frontend/src/context/ProgressContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('enphisim-progress');
      if (!saved) {
        return {
          completedLevels: {},
          actions: [],
          xp: 0
        };
      }
      // Use safe JSON parse
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse progress from localStorage:', error);
      return {
        completedLevels: {},
        actions: [],
        xp: 0
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('enphisim-progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }, [progress]);

  const recordAction = (levelId, action) => {
    setProgress(prev => ({
      ...prev,
      actions: [...prev.actions, {
        levelId,
        action,
        timestamp: new Date().toISOString()
      }]
    }));
  };

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

  return (
    <ProgressContext.Provider value={{ progress, recordAction, markLevelComplete }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);