
const EspModel= require('../models/esp.model');

const getAll = async (req,res) => {
    console.log('alooo')
    await   EspModel.find()
        .then(result => {
            console.log(result);
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.send({message: error.message})
        })
}
const newEsp= async (req,res) => {
    const data = req.body;
    const newEsp = new EspModel({
        adresseMac : data.adresseMac,
        adresse : data.adresse,
        userId: data.userId,
    });
    await newEsp.save()
    .then(data => {
        res.json({message: "Sucess, correctly added to the dataBASE"});
    })
    .catch(err => {
        res.status(400).json({message : err.message});
    })
}


const getEspById = async (req,res) => {
    const idUser = req.params.id;
    await EspModel.find({userId : idUser})
        .then(rslt => {
            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur : "pas d'ESP connu ...."})
        })
        .catch(err => {
            res.status(400).send({message : err.message});
        })
}

module.exports = {
    getAll : getAll,
    newEsp : newEsp,
    getEspById:getEspById
}
