import express from "express";
import Level from "../models/Level.js";

const router = express.Router();
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    const rawLevelNo = String(level_no || "").trim();
    const normalizedNumber = rawLevelNo.replace(/^l/i, "");
    const categoryPattern = new RegExp(`^${escapeRegex(String(category || "").trim())}$`, "i");

    const levelNoPatterns = [new RegExp(`^${escapeRegex(rawLevelNo)}$`, "i")];
    if (normalizedNumber && normalizedNumber !== rawLevelNo) {
      levelNoPatterns.push(new RegExp(`^l?${escapeRegex(normalizedNumber)}$`, "i"));
    }

    const level = await Level.findOne({
      $and: [
        {
          $or: [
            { category: categoryPattern },
            { level_category: categoryPattern },
            { difficulty: categoryPattern },
          ],
        },
        {
          $or: [
            { Level_no: { $in: levelNoPatterns } },
            { level_no: { $in: levelNoPatterns } },
            { id: { $in: levelNoPatterns } },
          ],
        },
      ],
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
