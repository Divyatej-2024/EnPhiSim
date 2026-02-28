// src/useDashboardAnalytics.js

import { useMemo } from "react";

export default function useDashboardAnalytics(progress, levels, mlAnalysis = null) {
  return useMemo(() => {
    const completedLevels = progress?.completedLevels || {};
    const rawActions = Array.isArray(progress?.actions) ? progress.actions : [];

    /* ================= LEVEL COMPLETION ================= */
    const completed = Object.keys(completedLevels).length;
    const totalLevels = Array.isArray(levels) ? levels.length :0;

    const completionRate =
      totalLevels > 0
        ? Math.round((completed / totalLevels) * 100)
        : 0;

    /* ================= FLATTEN ALL ACTIONS ================= */
    const localTotalActions = rawActions.length;

    const safeActions = rawActions.filter(
      (a) => (a?.isCorrect ?? a?.correct) === true
    ).length;

    const riskyActions = rawActions.filter(
      (a) => (a?.isCorrect ?? a?.correct) === false
    ).length;

    const localAccuracy =
      localTotalActions > 0
        ? Math.round((safeActions / localTotalActions) * 100)
        : 0;

    const totalActions = Number.isFinite(Number(mlAnalysis?.results?.length))
      ? mlAnalysis.results.length
      : localTotalActions;
    const accuracy = Number.isFinite(Number(mlAnalysis?.accuracy))
      ? Math.round(Number(mlAnalysis.accuracy))
      : localAccuracy;
    const riskScore = Number.isFinite(Number(mlAnalysis?.risk_score))
      ? Number(mlAnalysis.risk_score)
      : null;
    const modelAccuracy = Number.isFinite(Number(mlAnalysis?.model_accuracy))
      ? Number(mlAnalysis.model_accuracy)
      : null;
    const mlActive = Boolean(mlAnalysis);

    /* ================= NEXT LEVEL ================= */
    const nextLevel = Array.isArray(levels)
    ? levels.find((l) => !completedLevels[l?.level_no])
    : null;

    let nextLevelTitle = "Training Completed!";
    let nextLevelPath = "/thankyou";
    let buttonText = "View Summary";

    if (nextLevel) {
      nextLevelTitle = nextLevel.page_title || "";
      nextLevelPath = `/levels/${nextLevel.category}/${nextLevel.level_no}`;
      buttonText = completed === 0 ? "Start Training" : "Continue Training";
    }

    return {
      completed,
      totalLevels,
      completionRate,
      totalActions,
      safeActions,
      riskyActions,
      accuracy,
      riskScore,
      modelAccuracy,
      mlActive,
      nextLevelTitle,
      nextLevelPath,
      buttonText,
    };
  }, [progress, levels, mlAnalysis]);
}
