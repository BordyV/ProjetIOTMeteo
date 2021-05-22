const mongoose = require('mongoose');

const EspSchema = mongoose.Schema({
    adresseMac: String,
    adresse: String,
    userId: String
});

module.exports = mongoose.model('ESP_DATA', EspSchema,'ESP_DATA');
