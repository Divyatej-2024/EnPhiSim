import express from "express";
import Scenario from "../models/Scenario.js";

const router = express.Router();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/scenarios", async (req, res) => {
  try {
    const { category, level_no } = req.query;

    const query = {};
    if (category) {
      query.category = new RegExp(`^${escapeRegex(String(category).trim())}$`, "i");
    }
    if (level_no) {
      const rawLevel = String(level_no).trim();
      const normalized = rawLevel.replace(/^l/i, "");
      query.level_no = new RegExp(`^l?${escapeRegex(normalized || rawLevel)}$`, "i");
    }

    const docs = await Scenario.find(query).lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/scenarios/:category/:level_no", async (req, res) => {
  try {
    const { category, level_no } = req.params;
    const rawLevel = String(level_no || "").trim();
    const normalized = rawLevel.replace(/^l/i, "");

    const doc = await Scenario.findOne({
      category: new RegExp(`^${escapeRegex(String(category || "").trim())}$`, "i"),
      level_no: new RegExp(`^l?${escapeRegex(normalized || rawLevel)}$`, "i"),
    }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
