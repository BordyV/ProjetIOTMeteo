const espController = require('../controllers/esp');
const express = require('express');
const router = express.Router();
router.post('/addEsp', espController.newEsp); // créer un nouvel utilisateur (voir le model pour le body)

router.get('/', espController.getAll);
router.post('/addEsp', espController.newEsp);

module.exports = router;
