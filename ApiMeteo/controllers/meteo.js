
const MeteoModel= require('../models/meteo.model.js');
const getMeteo = async (req,res) => {
    await   MeteoModel.collection('METEO_DATA').find()
        .then(result => {
             console.log(result);
            res.status(200).send(result)
        })
        .catch(error => {
            res.send({message: error.message})
        })
}

module.exports = {
    getMeteo : getMeteo,
}
