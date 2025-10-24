// backend/routes/levelRoutes.js
const express = require('express');
const { getLevels, createLevel } = require('../controllers/levelController');
const router = express.Router();

router.get('/', getLevels);
router.post('/', createLevel);

module.exports = router;
