const MeteoModel = require('../models/meteo.model.js');
const openWeatherConfig = require('../config/openWeatherConfig');
const weatherBitConfig = require('../config/weatherBitConfig');
var moment = require('moment');
const userModel = require('../models/user.model.js');

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


//permet de récuperer les dernières datas de l'esp
const getFreshMeteoById = async (req, res) => {
    //maximum de data par requete
    const maxData = 10000; 
    const addMac = req.params.id;
    const today = new Date();
    today.setDate(today.getDate() - 14);
    
    //.find permet de chercher dans le MeteoModel
    //.limit permet de limiter le nombre de données à recup 
    //.sort permet de trier par date -1 signifie qu'on recup les données depuis la dernière insérée
    await MeteoModel.find({id: addMac, date: {$gte: today.toLocaleString("sv-SE", {timeZone: "Europe/Paris"})}}).limit(maxData).sort( { date: -1 } )
        .then(rslt => {
            //.reverse permet d'inverser le tableau
            rslt.reverse();
            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur: "ESP inconnu ...."})
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })
}

function distance(lat1, lat2, lon1, lon2) {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI / 180; // φ, λ in radians
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dy = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dy / 2) * Math.sin(dy / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

function testHumidity(espH1, h2) {
    //console.log('humid : ',espH1, h2)
    return (espH1 <= h2 + 10) && (espH1 >= h2 - 10);
}

function testTemp(espT1, t2) {
    //console.log('temp : ',espT1, t2)
    return (espT1 <= t2 + 2.5) && (espT1 >= t2 - 2.5);
}

function testPression(espP1, p2) {
    //console.log('pression: ',espP1, p2)
    return (espP1 <= p2 + 5) && (espP1 >= p2 - 5);
}

const previsionbyId = async (req, res) => {
    //adresse envoyé par l'utilisateur
    const id = req.params.id;
    console.log(id)
    //fetch sur l'api openWeatherMap
    //

    await userModel.find({_id: id})
        .then(rslt => {

            console.log(rslt);
            if (rslt.length) {
                fetch(
                    `${openWeatherConfig.openWeather_url}forecast?q=${rslt[0].userAddress}&units=metric&APPID=${openWeatherConfig.openWeatherKey}`)
                    .then((resFetch) => {
                        resFetch.json().then((body) => {
                            res.status(200).send(body)
                        });
                    }).catch(err => {
                    res.send(err);
                });
            }
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })


}
const prevision = async (req, res) => {
    //fetch sur l'api openWeatherMap
    const adress = req.params.adress;
    await fetch(
        `${openWeatherConfig.openWeather_url}forecast?q=${adress}&units=metric&APPID=${openWeatherConfig.openWeatherKey}`)
        .then((resFetch) => {
            resFetch.json().then((body) => {
                res.status(200).send(body);
            });
        }).catch(err => {
            res.send(err);
        });

}


const verificationDonnes = async (req, res) => {
    const esp = req.body;
    if (moment(esp.date).day() !== moment().day()) {
        console.log('pas frais')
        res.status(400).json({data: 'data de l esp pas a jour'})
    } else {
        console.log(esp);
        const adresse = {
            lat: esp.adresse.lat,
            lon: esp.adresse.lng
        }

        let dataApi1 = undefined;
        let dataApi2 = undefined;

        await fetch(
            `${openWeatherConfig.openWeather_url}weather?lat=${adresse.lat}&lon=${adresse.lon}&units=metric&APPID=${openWeatherConfig.openWeatherKey}`)
            .then((resFetch) => {
                resFetch.json().then((body) => {
                    dataApi2 = body;
                    fetch(
                        `${weatherBitConfig.weatherBit_url}?lat=${adresse.lat}&lon=${adresse.lon}&key=${weatherBitConfig.weatherBitKey}`)
                        .then((resFetch) => {
                            resFetch.json().then((body) => {
                                //console.log(body)
                                dataApi1 = body;
                                let objetValid = {
                                    temperature: testTemp(esp.temperature, dataApi1.data[0].temp) || testTemp(esp.temperature, dataApi2.main.temp),
                                    pression: testPression(esp.pression, dataApi1.data[0].pres) || testPression(esp.temperature, dataApi2.main.pressure),
                                    humidite: testHumidity(esp.humidite, dataApi1.data[0].rh) || testHumidity(esp.humidite, dataApi2.main.humidity)
                                }
                                //console.log(objetValid);
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
    verificationDonnes: verificationDonnes,
    previsionbyId: previsionbyId,
    prevision: prevision
}
