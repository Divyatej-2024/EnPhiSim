// backend/routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const { submitAttempt } = require('../controllers/attemptController');

router.post('/:level', submitAttempt);

module.exports = router;