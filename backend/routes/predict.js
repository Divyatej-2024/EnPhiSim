import express from "express";
import mlPredict from "../utils/mlClient.js";

const router = express.Router();
router.post("/predict", async (req, res) => {
  try {
    console.log("[/api/predict] incoming body:", req.body);

    const data = await mlPredict(req.body);

    console.log("[/api/predict] ML response:", data);
    res.json(data);
  } catch (error) {
    console.error("[/api/predict] ERROR:", {
      message: error.message,
      stack: error.stack,
      responseData: error.response?.data,
      code: error.code,
    });

    res.status(500).json({ error: "ML API unreachable" });
  }
});

export default router;
