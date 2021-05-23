
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
module.exports = {
    getAll : getAll,
    newEsp : newEsp,
}
