// src/context/ProgressContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const [actions, setActions] = useState(() => {
    try {
      const raw = localStorage.getItem("enphisim_actions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to read enphisim_actions", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("enphisim_actions", JSON.stringify(actions));
    } catch (e) {
      console.error("Failed to write enphisim_actions", e);
    }
  }, [actions]);

  const recordAction = (levelId, optionId, isCorrect = false, points = 0, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      levelId,
      optionId,
      isCorrect,
      points,
      meta
    };
    setActions(prev => [...prev, entry]);
    return entry;
  };

  const resetActions = () => {
    setActions([]);
    localStorage.removeItem("enphisim_actions");
  };

  return (
    <ProgressContext.Provider value={{ actions, recordAction, resetActions }}>
      {children}
    </ProgressContext.Provider>
  );
}
