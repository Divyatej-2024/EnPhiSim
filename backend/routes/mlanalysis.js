import express from "express";
import Eaction from "../models/E_action.js";
import axios from "axios";

const router = express.Router();

function isRiskLabel(label) {
  const key = String(label || "").toLowerCase();
  return key.includes("wrong") || key.includes("phish") || key.includes("risk") || key.includes("malicious");
}

function isSafeLabel(label) {
  const key = String(label || "").toLowerCase();
  return key.includes("correct") || key.includes("safe") || key.includes("legitimate");
}

router.get("/analysis/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const actions = await Eaction.find({ UserID });
    const baseUrl = process.env.ML_SERVER_URL || process.env.ML_API_URL;

    if (!baseUrl) {
      return res.status(503).json({ error: "ML server URL is not configured" });
    }

    const items = actions
      .map((action, idx) => ({
        userId: action.UserID || UserID,
        levelId: action.LevelID || null,
        text: action.Action || "",
        _idx: idx,
      }))
      .filter((item) => item.text.trim().length > 0);

    if (items.length === 0) {
      return res.json({
        raw_actions: actions,
        accuracy: 0,
        probabilities: {},
        risk_score: 0,
        results: [],
      });
    }

    const server = baseUrl.replace(/\/+$/, "");
    let results = [];
    let modelAccuracy = null;

    try {
      const batchResp = await axios.post(`${server}/predict/batch`, { items });
      results = Array.isArray(batchResp.data?.results) ? batchResp.data.results : [];
      modelAccuracy = batchResp.data?.model_accuracy ?? null;
    } catch (batchErr) {
      const singles = await Promise.all(
        items.map(async (item) => {
          const singleResp = await axios.post(`${server}/predict`, {
            userId: item.userId,
            levelId: item.levelId,
            text: item.text,
          });
          return singleResp.data;
        })
      );
      results = singles;
      modelAccuracy = singles.find((x) => x?.model_accuracy != null)?.model_accuracy ?? null;
    }

    const total = results.length || 1;
    const riskyCount = results.filter((r) => isRiskLabel(r?.prediction)).length;
    const safeCount = results.filter((r) => isSafeLabel(r?.prediction)).length;

    const mergedProbabilities = {};
    for (const r of results) {
      const probs = r?.probabilities || {};
      for (const [label, value] of Object.entries(probs)) {
        mergedProbabilities[label] = (mergedProbabilities[label] || 0) + Number(value || 0);
      }
    }

    Object.keys(mergedProbabilities).forEach((label) => {
      mergedProbabilities[label] = Number((mergedProbabilities[label] / total).toFixed(4));
    });

    res.json({
      raw_actions: actions,
      accuracy: Number(((safeCount / total) * 100).toFixed(2)),
      probabilities: mergedProbabilities,
      risk_score: Number(((riskyCount / total) * 100).toFixed(2)),
      model_accuracy: modelAccuracy,
      results,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
