
const MeteoModel= require('../models/meteo.model.js');
const openWeatherConfig = require('../config/openWeatherConfig');
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

module.exports = {
    getMeteo : getMeteo,
    getMeteoById: getMeteoById,
    getMeteoOpenWeatherByAdress: getMeteoOpenWeatherByAdress
}
