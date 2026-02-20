import express from "express";
import Level from "../models/Level.js";

const router = express.Router();


// Get all levels (for dashboard only)
router.get("/levels", async (req, res) => {
  try {
    const levels = await Level.find({}, { scenarios: 0 }); 
    // Exclude scenarios for performance
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get ONE level with ONE random scenario
router.get("/levels/:level_id", async (req, res) => {
  try {
    const { level_id } = req.params;

    const level = await Level.findOne({ level_id });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    if (!level.scenarios || level.scenarios.length === 0) {
      return res.status(404).json({ message: "No scenarios found" });
    }

    // Random scenario
    const randomIndex = Math.floor(Math.random() * level.scenarios.length);
    const randomScenario = level.scenarios[randomIndex];

    res.json({
      level_id: level.level_id,
      title: level.title,
      type: level.type,
      scenario: randomScenario
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;