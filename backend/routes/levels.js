// routes/levels.js
import express from "express";
import Level from "../models/LevelModel.js"; // Your mongoose model

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.find(); // returns all levels
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
