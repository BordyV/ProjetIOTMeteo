const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    temperature: String,
    id: String,
    pression: String,
    altitude: String,
    lumiere: String,
    humidite: String
});

module.exports = mongoose.model('METEO_DATA', MeteoSchema,'METEO_DATA');
