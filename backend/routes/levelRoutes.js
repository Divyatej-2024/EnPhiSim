// backend/routes/levelRoutes.js
const express = require('express');
const router = express.Router();
const { getLevels, getLevelById } = require('../controllers/levelController');

router.get('/', getLevels);
router.get('/:id', getLevelById);

module.exports = router;
