const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    userFirstName : {
        type : String,
        required : true
    },
    userLastName : {
        type : String,
        required : true
    },
    userEmail : {
        type : String,
        required : true
    },
    userPassword : {
        type : String,
        required : true
    },
    userPhoneNumber : {
        type : String,
        required : true
    },
    userAddress : {
        type : String,
        required : true
    },
    picUrl: {
        type: String,
        required: false,
        default: "https://i.redd.it/aqrwgqlaaw851.jpg"
    },
});

module.exports = mongoose.model('USER_DATA',  UserSchema,'USER_DATA');
