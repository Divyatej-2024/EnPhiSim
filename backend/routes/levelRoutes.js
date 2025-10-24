<<<<<<< HEAD
// backend/routes/levelRoutes.js
const express = require('express');
const router = express.Router();
const { getLevels, getLevelById } = require('../controllers/levelController');

router.get('/', getLevels);
router.get('/:id', getLevelById);

module.exports = router;
=======
// backend/routes/levelRoutes.js
const express = require('express');
const router = express.Router();
const { getLevels, getLevelById } = require('../controllers/levelController');

router.get('/', getLevels);
router.get('/:id', getLevelById);

module.exports = router;
>>>>>>> 622a2f58a21cb608242fa59b8e4c35dfb00d67b0
