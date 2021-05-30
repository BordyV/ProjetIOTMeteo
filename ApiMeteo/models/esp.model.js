const mongoose = require('mongoose');



const adresseEspSchema = mongoose.Schema({
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },

});

const EspSchema = mongoose.Schema({
    adresseMac: { type: String, required: true },
    adresse: {
        type: adresseEspSchema, required: true
    },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('ESP_DATA', EspSchema, 'ESP_DATA');
