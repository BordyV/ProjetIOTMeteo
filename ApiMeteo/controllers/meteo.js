
const MeteoModel= require('../models/meteo.model.js');
const openWeatherConfig = require('../config/openWeatherConfig');
const weatherBitConfig = require('../config/weatherBitConfig');


const fetch = require("node-fetch");




const getMeteo = async (req,res) => {
    console.log('alooo')
    await   MeteoModel.find()
            .then(result => {
             console.log(result);
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.send({message: error.message})
        })
}

const getMeteoById = async (req,res) => {
    const addMac = req.params.id;
    await MeteoModel.find({id : addMac})
    .then(rslt => {
        rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur : "ESP inconnu ...."})
    })
    .catch(err => {
        res.status(400).send({message : err.message});
    })
}

//Permet de récuperer les données de l'api openWeather
const getMeteoOpenWeatherByAdress = async (req,res) => {
    //adresse envoyé par l'utilisateur
    const adress = req.params.adress;
    //fetch sur l'api openWeatherMap
    await fetch(
        `${openWeatherConfig.openWeather_url}weather?q=${adress}&units=metric&APPID=${openWeatherConfig.openWeatherKey}`)
        .then((resFetch) => {
            resFetch.json().then((body)=> {
                res.status(200).send(body);
            });
          }).catch(err => {
            res.send(err);
        });


}
//https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely

const getMeteoWeatherBitByAdress = async (req,res) => {
    

    //adresse envoyé par l'utilisateur
    const lat = req.params.lat;
    const lon = req.params.lon;
    console.log(`${weatherBitConfig.weatherBit_url}?${lat}&${lon}&key=${weatherBitConfig.weatherBitKey}`);
    //fetch sur l'api openWeatherMap
    await fetch(
        `${weatherBitConfig.weatherBit_url}?${lat}&${lon}&key=${weatherBitConfig.weatherBitKey}`)
        .then((resFetch) => {
            resFetch.json().then((body)=> {
                res.status(200).send(body);
            });
          }).catch(err => {
            res.send(err);
        });


}

const getFreshMeteoById = async (req,res) => {
    const addMac = req.params.id;
    const today = new Date();
    today.setDate( today.getDate() - 14 );
    await MeteoModel.find({id : addMac,date : { $gte : today.toLocaleString("sv-SE", {timeZone: "Europe/Paris"})}})
        .then(rslt => {

            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur : "ESP inconnu ...."})
        })
        .catch(err => {
            res.status(400).send({message : err.message});
        })
}

const verificationDonnes = async (req,res) => {

}
module.exports = {
    getMeteo : getMeteo,
    getMeteoById: getMeteoById,
    getFreshMeteoById:getFreshMeteoById,
    getMeteoOpenWeatherByAdress: getMeteoOpenWeatherByAdress,
    getMeteoWeatherBitByAdress : getMeteoWeatherBitByAdress,
    verificationDonnes : verificationDonnes
}
