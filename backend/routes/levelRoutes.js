import express from "express";
import Level from "../models/Level.js";

const router = express.Router();

// Get all levels for dashboard listing.
router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.aggregate([
      { $match: { Level_no: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: { Level_no: "$Level_no", category: "$category" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { Level_no: 1 } },
    ]);
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
