// backend/routes/scenarios.js
const express = require('express');
const router = express.Router();
const Scenario = require('../models/Scenario'); // Your model

// GET all scenarios grouped by level
router.get('/scenarios', async (req, res) => {
  try {
    const scenarios = await Scenario.find().sort({ level_no: 1, scenario_id: 1 });
    
    // Group by level for easier frontend consumption
    const groupedByLevel = scenarios.reduce((acc, scenario) => {
      const level = scenario.level_no;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(scenario);
      return acc;
    }, {});
    
    res.json({
      total: scenarios.length,
      levels: Object.keys(groupedByLevel).length,
      grouped: groupedByLevel,
      all: scenarios
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET scenarios by level
router.get('/scenarios/level/:levelNo', async (req, res) => {
  try {
    const scenarios = await Scenario.find({ 
      level_no: req.params.levelNo 
    }).sort({ scenario_id: 1 });
    
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single scenario
router.get('/scenarios/:scenarioId', async (req, res) => {
  try {
    const scenario = await Scenario.findOne({ 
      scenario_id: req.params.scenarioId 
    });
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;