const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const accountSchema = new mongoose.Schema({
    Firstname: String ,
    Lastname: String ,
    Username: String ,
    Domain: String,
    Dateofbirth: Date ,
    Gender: String ,
    Email: String,
    Password: String,
    Gender: String,
    UniqueId: String,
    Role: String,
    Number: String,
    About: String,
    SecondaryMail: String,
    imgUrl : String
});

const userData = mainData.model('Account', accountSchema);

module.exports = {
  userData
};