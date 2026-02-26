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
    const levelNoSet = new Set([rawLevelNo.toLowerCase()]);
    if (normalizedNumber) {
      levelNoSet.add(normalizedNumber.toLowerCase());
      levelNoSet.add(`l${normalizedNumber}`.toLowerCase());
    }

    const candidates = await Level.find({
      $or: [
        { category: categoryPattern },
        { level_category: categoryPattern },
        { difficulty: categoryPattern },
      ],
    }).lean();

    const level = candidates.find((item) => {
      const valueCandidates = [
        item?.Level_no,
        item?.level_no,
        item?.id,
      ]
        .filter((v) => v !== undefined && v !== null)
        .map((v) => String(v).trim().toLowerCase());

      return valueCandidates.some((v) => levelNoSet.has(v));
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
