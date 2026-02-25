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
router.get("/levels/:category/:level_no", async (req, res) => {
  try {
    const { category, level_no } = req.params;

    const scenarios = await Level.findOne({ category,level_no });

    if (!scenarios || scenarios.length ==0 ) {
      return res.status(404).json({ message: "Scenarios Not Found" });
    }

    // Random scenario
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    const randomScenario = scenarios[randomIndex];

    res.json({
      randomScenario
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;