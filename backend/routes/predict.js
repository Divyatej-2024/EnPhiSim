import express from "express";
import { mlPredict } from "../utils/mlClient.js";

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const data = await mlPredict(req.body);
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message || "ML API unreachable" });
  }
});

export default router;
