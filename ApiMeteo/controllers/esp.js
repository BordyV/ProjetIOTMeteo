
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

module.exports = {
    getAll : getAll,
}
