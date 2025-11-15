import React, { createContext, useContext, useState, useEffect } from "react";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [actions, setActions] = useState(() => {
    try {
      const raw = localStorage.getItem("enphisim_actions");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("enphisim_actions", JSON.stringify(actions));
    } catch (e) {
      console.error("Failed to save actions:", e);
    }
  }, [actions]);

  const addAction = (action) => {
    setActions((prev) => [...prev, action]);
  };

  return (
    <ProgressContext.Provider value={{ actions, addAction }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
