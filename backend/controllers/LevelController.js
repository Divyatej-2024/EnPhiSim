// backend/controllers/levelController.js
const Level = require('../models/Level');

exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort({ level: 1 });
    res.json(levels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching levels' });
  }
};

exports.getLevelById = async (req, res) => {
  try {
    const level = await Level.findOne({ level: parseInt(req.params.id, 10) });
    if (!level) return res.status(404).json({ message: 'Level not found' });
    res.json(level);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching level' });
  }
};
