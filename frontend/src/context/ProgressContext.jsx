// frontend/src/context/ProgressContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completedLevels, setCompletedLevels] = useState({});
  const [actions, setActions] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);

  const recordAction = useCallback(async (levelId, actionRecord) => {
    setActions(prev => [...prev, actionRecord]);
    return true;
  }, []);

  const completeLevel = useCallback(async (levelId) => {
    setCompletedLevels(prev => ({ ...prev, [levelId]: true }));
    return true;
  }, []);

  // getLevelScenario — returns a deterministic scenario from a pool
  // so the same level always shows the same scenario per session
  const getLevelScenario = useCallback((scenarioKey, scenarios) => {
    if (!scenarios || scenarios.length === 0) return null;
    // Use a simple hash of the scenarioKey to pick a consistent scenario
    let hash = 0;
    for (let i = 0; i < scenarioKey.length; i++) {
      hash = ((hash << 5) - hash) + scenarioKey.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % scenarios.length;
    return scenarios[index];
  }, []);

  const setSessionTimeTaken = useCallback((time) => {
    setTimeTaken(time);
  }, []);

  // The `progress` object used by Thankyou.jsx
  const progress = {
    completedLevels,
    actions,
    timeTaken,
  };

  return (
    <ProgressContext.Provider value={{
      completedLevels,
      actions,
      progress,
      recordAction,
      completeLevel,
      getLevelScenario,
      setSessionTimeTaken,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}