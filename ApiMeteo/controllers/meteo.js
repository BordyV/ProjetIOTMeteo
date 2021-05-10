
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

module.exports = {
    getMeteo : getMeteo,
}
