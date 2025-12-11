import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

router.get("/levels", async (req, res) => {
  try {
    const allLevels = await Level.find();

    // Convert MongoDB fields to frontend format
    const levelsFormatted = allLevels.map((lvl) => ({
      _id: lvl._id,
      Level_no: lvl.level,      // IMPORTANT FIX
      title: lvl.title,
      category: lvl.category,
      difficulty: lvl.difficulty,
      description: lvl.description,
      sampleEmail: lvl.sampleEmail,
      correctAction: lvl.correctAction,
      hint: lvl.hint,
      baseXP: lvl.baseXP,
      tags: lvl.tags,
    }));

    res.json(levelsFormatted);
  } catch (err) {
    console.error("Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
