const meteoController = require('../controllers/meteo');
const express = require('express');
const router = express.Router();


router.get('/', meteoController.getMeteo);

module.exports = router;
