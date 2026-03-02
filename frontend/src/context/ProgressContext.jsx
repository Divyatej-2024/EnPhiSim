// frontend/src/context/ProgressContext.js
import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [completedLevels, setCompletedLevels] = useState([]);
  const [actions, setActions] = useState([]);

  const recordAction = async (levelId, actionRecord) => {
    setActions(prev => [...prev, actionRecord]);
    console.log('Action recorded:', levelId, actionRecord);
    return true;
  };

  const completeLevel = async (levelId) => {
    setCompletedLevels(prev => [...prev, levelId]);
    console.log('Level completed:', levelId);
    return true;
  };

  return (
    <ProgressContext.Provider value={{
      completedLevels,
      actions,
      recordAction,
      completeLevel
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