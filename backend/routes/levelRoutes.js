import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

// Correct route: /api/levels
router.get("/levels", async (req, res) => {
  try {
    const allLevels = await Level.find();

    // Transform MongoDB fields into frontend-compatible fields
    const formattedLevels = allLevels.map(lvl => ({
      id: lvl._id,
      Level_no: lvl.level,
      page_title: lvl.title,
      category: lvl.category,
      difficulty: lvl.difficulty,
      description: lvl.description,
      sampleEmail: lvl.sampleEmail,
      correctAction: lvl.correctAction,
      hint: lvl.hint,
      baseXP: lvl.baseXP,
      tags: lvl.tags,
    }));

    res.json(formattedLevels);

  } catch (err) {
    console.error("Error fetching levels:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
});

export default router;
