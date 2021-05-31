const meteoController = require('../controllers/meteo');
const express = require('express');
const router = express.Router();
const token = require('../auth');

router.get('/', meteoController.getMeteo);
router.get('/adresseMac/:id',meteoController.getMeteoById);
router.get('/freshData/:id', meteoController.getFreshMeteoById);
router.get('/openWeatherMeteo/:adress',meteoController.getMeteoOpenWeatherByAdress);
router.get('/prevision/:adress', meteoController.prevision);
router.post('/verif' ,meteoController.verificationDonnes);
router.get('/previsionbyid/:id' ,token,meteoController.previsionbyId);
module.exports = router;
