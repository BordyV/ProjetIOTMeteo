const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    temperature: String,
    id: String, //adresseMac
    pression: String,
    altitude: String,
    lumiere: String,
    humidite: String,
    //idUser: String
});

module.exports = mongoose.model('METEO_DATA', MeteoSchema,'datas');
