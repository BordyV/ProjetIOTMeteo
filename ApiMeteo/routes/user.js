const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

// POST
router.post('/addUser', userController.newUser); // créer un nouvel utilisateur (voir le model pour le body)

router.post('/connection', userController.connection); // créer un nouvel utilisateur (voir le model pour le body)
router.post('/isAlreadyRegistered', userController.isAlreadyRegistered); // créer un nouvel utilisateur (voir le model pour le body)
// GET
router.get('/', userController.getUsers); // renvoi tous les users 
router.get('/name/:name', userController.getUserByName);
router.get('/id/:id', userController.getUserById);

//
router.patch('/id/:id/setPic', userController.setUserPicture);


module.exports = router;

