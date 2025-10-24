<<<<<<< HEAD
// backend/routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const { submitAttempt } = require('../controllers/attemptController');

router.post('/:level', submitAttempt);

module.exports = router;
=======
// backend/routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const { submitAttempt } = require('../controllers/attemptController');

router.post('/:level', submitAttempt);

module.exports = router;
>>>>>>> 622a2f58a21cb608242fa59b8e4c35dfb00d67b0
