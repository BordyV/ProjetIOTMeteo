const MeteoModel = require('../models/meteo.model.js');
const openWeatherConfig = require('../config/openWeatherConfig');
const weatherBitConfig = require('../config/weatherBitConfig');
var moment = require('moment');

const fetch = require("node-fetch");


const getMeteo = async (req, res) => {

    await MeteoModel.find()
        .then(result => {
            //console.log(result);
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.send({message: error.message})
        })
}

const getMeteoById = async (req, res) => {
    const addMac = req.params.id;
    await MeteoModel.find({id: addMac})
        .then(rslt => {
            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur: "ESP inconnu ...."})
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })
}

//Permet de récuperer les données de l'api openWeather
const getMeteoOpenWeatherByAdress = async (req, res) => {
    //adresse envoyé par l'utilisateur
    const adress = req.params.adress;
    //fetch sur l'api openWeatherMap
    await fetch(
        `${openWeatherConfig.openWeather_url}weather?q=${adress}&units=metric&APPID=${openWeatherConfig.openWeatherKey}`)
        .then((resFetch) => {
            resFetch.json().then((body) => {
                res.status(200).send(body);
            });
        }).catch(err => {
            res.send(err);
        });


}
//https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely



const getFreshMeteoById = async (req, res) => {
    const addMac = req.params.id;
    const today = new Date();
    today.setDate(today.getDate() - 14);
    await MeteoModel.find({id: addMac, date: {$gte: today.toLocaleString("sv-SE", {timeZone: "Europe/Paris"})}})
        .then(rslt => {

            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur: "ESP inconnu ...."})
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })
}

const verificationDonnes = async (req, res) => {
    const esp = req.body;
    if (moment(esp.date).day() !== moment().day()) {
        console.log('pas frais')
        res.status(400).json({data:'data de l esp pas a jour'})
    } else {
        console.log(esp);
        const adresse = {
            lat: esp.adresse.lat,
            lon: esp.adresse.lat
        }

        let dataApi1 = undefined;
        let dataApi2 = undefined;

        await fetch(
            `${openWeatherConfig.openWeather_url}weather?lat=${adresse.lat}&lon=${adresse.lon}&APPID=${openWeatherConfig.openWeatherKey}`)
            .then((resFetch) => {
                resFetch.json().then((body) => {
                    dataApi2 = body;
                    fetch(
                        `${weatherBitConfig.weatherBit_url}?lat=${adresse.lat}&lon=${adresse.lonx}&key=${weatherBitConfig.weatherBitKey}`)
                        .then((resFetch) => {
                            resFetch.json().then((body) => {
                                //console.log(body)
                                dataApi1 = body;
                                console.log('donnee biss: ', dataApi1)
                                console.log('donnee open: ', dataApi2)
                                let objetValid = {
                                    lumiere: true,
                                    temperature:false,
                                    pression:true,
                                    humidity:false
                                }
                                res.status(200).json(objetValid)

                            });
                        }).catch(err => {
                        console.log(err)
                    });

                })
            });
    }
}

module.exports = {
    getMeteo: getMeteo,
    getMeteoById: getMeteoById,
    getFreshMeteoById: getFreshMeteoById,
    getMeteoOpenWeatherByAdress: getMeteoOpenWeatherByAdress,
    verificationDonnes: verificationDonnes
}
