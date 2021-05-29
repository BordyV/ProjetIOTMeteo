const espController = require('../controllers/esp');
const express = require('express');
const router = express.Router();
const token = require('../auth');
router.post('/addEsp', espController.newEsp); // créer un nouvel utilisateur (voir le model pour le body)

router.get('/', espController.getAll);
router.get('/getEsp/:id',token ,espController.getEspById);
router.post('/addEsp', token,espController.newEsp);

module.exports = router;
