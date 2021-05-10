const meteoController = require('../controllers/meteo');
const express = require('express');
const router = express.Router();


router.get('/meteo', meteoController.getMeteo);

module.exports = router;
