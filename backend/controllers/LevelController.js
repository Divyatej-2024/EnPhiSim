// backend/controllers/LevelController.js
const getLevels = (req, res) => {
  res.json([{ id: 1, name: "Level 1" }, { id: 2, name: "Level 2" }]);
};

const createLevel = (req, res) => {
  res.json({ message: "Level created successfully", body: req.body });
};

module.exports = { getLevels, createLevel };
