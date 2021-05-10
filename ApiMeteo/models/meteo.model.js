const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    temperature: String,
    id: String,
    pression: String,
    altitude: String,
    lumiere: String,
    humidite: String
}, {
    timestamps: true
});

module.exports = mongoose.model('meteo', MeteoSchema);
