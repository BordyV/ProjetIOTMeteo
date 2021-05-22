const espController = require('../controllers/esp');
const express = require('express');
const router = express.Router();


router.get('/', espController.getAll);

module.exports = router;
