const mongoose = require('mongoose');

const EspSchema = mongoose.Schema({
    adresseMac: {type: String, required: true},
    adresse: {type: String, required: true},
    userId: {type: String, required: true}
});

module.exports = mongoose.model('ESP_DATA', EspSchema, 'ESP_DATA');
