const userModel = require('../models/user.model');
const { Mongoose } = require('mongoose');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const newUser = async (req,res) => {
    const data = req.body;
    const newUser = new userModel({
        userFirstName : data.userFirstName.toUpperCase(),
        userLastName : data.userLastName.toUpperCase(),
        userEmail : data.userEmail,
        userPassword : md5(data.userPassword),
        userPhoneNumber : data.userPhoneNumber,
        userAddress : data.userAddress,

    });
    await newUser.save()
    .then(data => {
        res.json({message: "Sucess, correctly added to the dataBASE"});
    })
    .catch(err => {
        res.status(400).json({message : err.message});
    })
}

const getUsers = async (req,res) => {
    await userModel.find()
    .then(result => {
       res.status(200).send(result)
    })
    .catch(error => {
        res.send({message : error.message})
    })
}
const getUserByName = async (req,res) => {
    const name = req.params.name;
    await userModel.find({userName : name})
    .then(rslt => {
        rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur : "Utilisateur inconnu ...."})
    })
    .catch(err => {
        res.status(400).send({message : err.message});
    })
}
const isAlreadyRegistered = async (req,res) => {
    const body = req.body;
    await userModel.find({userEmail : body.userEmail})
    .then(rslt => {
        rslt.length ? res.status(403).json({erreur: "Déjà inscrit..."}) : res.status(200).json({erreur : "Tu peux entrer akhi"})
    })
    .catch(err => {
        res.status(400).send({message : err.message});
    })
}

const getUserById = async (req,res) => {
    const id = req.params.id;
    await userModel.find({_id : id})
    .then(rslt => {
        rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur : "Utilisateur inconnu ...."})
    })
    .catch(err => {
        res.status(400).send({message : err.message});
    })
}




const connection = async (req,res) => {
    const data = req.body;
    console.log(process.env.JWT_SECRET);
    await userModel.find({userEmail : data.userEmail})
    .then(result => {
        if(result.length > 0){
            if(md5(data.userPassword) === result[0].userPassword){
                //res.status(200).send({message : `Great success ! ${result[0].userFirstName + " " + result[0].userLastName } is connected !`, userId: result[0]._id})
                console.log(process.env.JWT_SECRET);
                jwt.sign(
                    { email : data.userEmail, id: result[0]._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d"},
                    (err, token) => {
                        if (err) throw err;
                        res.status(200).json(
                            {
                                code: res.statusCode,
                                token
                            });
                            }
                        );
                        console.log(process.env.JWT_SECRET);                        

            }else{
                res.status(401).send({message : "Wrong password"})
            }
        }else{
            res.status(401).send({message : "Wrong email"})
        }
    })
    .catch(error => {
        res.status(400).send({message : error.message})
    })
}


const setUserPicture = async (req,res) => {
    const idUser = req.params.id;
    const data = req.body;
    console.log(data.picUrl)
    await userModel.findOneAndUpdate({_id : idUser}, {picUrl : data.picUrl}, (err, rslt) => {
            res.send({message : "Succesfully updated"})
    })
}


module.exports = {
    newUser : newUser,
    getUsers : getUsers,
    getUserByName : getUserByName,
    getUserById : getUserById,
    connection : connection,
    isAlreadyRegistered: isAlreadyRegistered,
    setUserPicture : setUserPicture,

}
