import express from "express";
import Eaction from "../models/E_action.js";
import axios from "axios";

const router = express.Router();
const ML_SERVER = process.env.ML_SERVER_URL;

router.get("/analysis/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const actions = await Eaction.find({ UserID });

    if (!ML_SERVER) {
      return res.status(500).json({
        error: "ML server URL is not configured",
        raw_actions: actions
      });
    }

    const mlResponse = await axios.post(`${ML_SERVER}/predict`, { data: actions });

    res.json({
      raw_actions: actions,
      accuracy: mlResponse.data.accuracy ?? mlResponse.data.model_accuracy ?? null,
      probabilities: mlResponse.data.probabilities ?? null,
      risk_score: mlResponse.data.risk_score ?? null,
      prediction: mlResponse.data.prediction ?? null,
      confidence: mlResponse.data.confidence ?? null
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
