const meteoController = require('../controllers/meteo');
const express = require('express');
const router = express.Router();


router.get('/', meteoController.getMeteo);
router.get('/adresseMac/:id', meteoController.getMeteoById);
router.get('/openWeatherMeteo/:adress', meteoController.getMeteoOpenWeatherByAdress);

module.exports = router;
