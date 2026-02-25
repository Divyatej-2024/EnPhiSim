import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

// Get all levels for dashboard listing.
router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.find({});
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one level by category + level number.
router.get("/levels/:category/:level_no", async (req, res) => {
  try {
    const { category, level_no } = req.params;

    const level = await Level.findOne({
      category,
      Level_no: String(level_no),
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    res.json(level);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;