// src/components/useDashboardAnalytics.js

import { useMemo } from "react";

export default function useDashboardAnalytics(progress, levels) {
  return useMemo(() => {
    const completedLevels = progress?.completedLevels || {};
    const attempts = progress?.attempts || {};

    /* ================= LEVEL COMPLETION ================= */
    const completed = Object.keys(completedLevels).length;
    const totalLevels = levels.length;

    const completionRate =
      totalLevels > 0
        ? ((completed / totalLevels) * 100).toFixed(1)
        : 0;

    /* ================= FLATTEN ALL ACTIONS ================= */
    const actions = Object.values(attempts).flat();
    const totalActions = actions.length;

    const safeActions = actions.filter(
      (a) => a.correct === true
    ).length;

    const riskyActions = actions.filter(
      (a) => a.correct === false
    ).length;

    const accuracy =
      totalActions > 0
        ? ((safeActions / totalActions) * 100).toFixed(1)
        : 0;

    /* ================= NEXT LEVEL ================= */
    const nextLevel = levels.find(
      (l) => !completedLevels[l.level_no]
    );

    let nextLevelTitle = "Training Completed!";
    let nextLevelPath = "/Thankyou";
    let buttonText = "Start Training";

    if (nextLevel) {
      nextLevelTitle = nextLevel.page_title;
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