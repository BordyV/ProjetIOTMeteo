
const MeteoModel= require('../models/meteo.model.js');



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

module.exports = {
    getMeteo : getMeteo,
    getMeteoById: getMeteoById,
}
