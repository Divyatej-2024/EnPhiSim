// src/useDashboardAnalytics.js

import { useMemo } from "react";

export default function useDashboardAnalytics(progress, levels) {
  return useMemo(() => {
    const completedLevels = progress?.completedLevels || {};
    const attempts = progress?.attempts || {};

    /* ================= LEVEL COMPLETION ================= */
    const completed = Object.keys(completedLevels).length;
    const totalLevels = Array.isArray(levels) ? levels.length :0;

    const completionRate =
      totalLevels > 0
        ? Math.round((completed / totalLevels) * 100)
        : 0;

    /* ================= FLATTEN ALL ACTIONS ================= */
    let actions =[];
    try {
      actions = Object.values(attempts || {})
      .filter(Array.isArray)
      .flat();
    } catch (e) {
      actions=[];
    }
    const totalActions = actions.length;

    const safeActions = actions.filter(
      (a) => a.correct === true
    ).length;

    const riskyActions = actions.filter(
      (a) => a.correct === false
    ).length;

    const accuracy =
      totalActions > 0
        ? Math.round((safeActions / totalActions) * 100)
        : 0;

    /* ================= NEXT LEVEL ================= */
    const nextLevel = Array.isArray(levels)
    ? levels.find((l) => !completedLevels[l?.level_no])
    : null;

    let nextLevelTitle = "Training Completed!";
    let nextLevelPath = "/Thankyou";
    let buttonText = "Start Training";

    if (nextLevel) {
      nextLevelTitle = nextLevel.page_title || "";
      nextLevelPath = `/levels/${nextLevel.category}/${nextLevel.level_no}`;
      buttonText =
        completed === 0
          ? "Start Training"
          : "Continue Training";
    }

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
  }, [progress, levels]);
}