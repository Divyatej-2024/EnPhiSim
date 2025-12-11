// backend/routes/levelRoutes.js
import express from "express";
import LevelSchema from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.find();
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
