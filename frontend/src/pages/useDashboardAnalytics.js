// src/hooks/useDashboardAnalytics.js

import { useMemo } from 'react';

/**
 * Custom hook to calculate dashboard analytics from the progress object.
 * @param {object} progress - The progress object from useProgress.
 * @param {array} levels - The full array of level data.
 * @returns {object} An object containing all calculated metrics and next level data.
 */
export default function useDashboardAnalytics(progress, levels) {
  // Use useMemo to ensure calculations only re-run if progress or levels change
  const analytics = useMemo(() => {
    // ---------------------------
    // 1. COMPLETION CALCULATIONS
    // ---------------------------
    const completed = Object.keys(progress.completedLevels).length;
    const totalLevels = levels.length;
    
    const completionRate =
      totalLevels > 0 ? ((completed / totalLevels) * 100).toFixed(1) : 0;

    // ---------------------------
    // 2. ACTION & ACCURACY CALCULATIONS
    // ---------------------------
    const attempts = progress.attempts || {};
    let actions = [];

    // Flatten all attempts into a single actions array
    Object.values(attempts).forEach(entry => {
      if (Array.isArray(entry)) {
        actions = [...actions, ...entry];
      } else if (entry && typeof entry === "object") {
        actions.push(entry);
      }
    });

    const totalActions = actions.length;
    const safeActions = actions.filter(a => a.correct === true).length;
    const riskyActions = actions.filter(a => a.correct === false).length;

    const accuracy =
      totalActions > 0 ? ((safeActions / totalActions) * 100).toFixed(1) : 0;

    // ---------------------------
    // 3. FIND CURRENT/NEXT LEVEL
    // ---------------------------
    const currentLevel = levels.find(
      lvl => !progress.completedLevels[lvl.id]
    );

    const nextLevelTitle = currentLevel
      ? currentLevel.page_title
      : "All Levels Completed!";

    const nextLevelPath = currentLevel
      ? `/levels/${currentLevel.category}/${currentLevel.Level_no}`
      : "/summary";

    const buttonText = currentLevel
      ? "Start Current Level"
      : "Review All Levels";

    return {
      completed,
      totalLevels,
      completionRate,
      totalActions,
      safeActions,
      riskyActions,
      accuracy,
      nextLevelTitle,
      nextLevelPath,
      buttonText,
    };
  }, [progress, levels]); // Dependencies

  return analytics;
}
