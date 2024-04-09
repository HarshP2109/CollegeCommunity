const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const connectSchema = new mongoose.Schema({
    FromUser: String ,
    FromID: String ,
    ToUser: String ,
    ToID: String,
    Connection: String 
});

const connection = mainData.model('Connections', connectSchema);

module.exports = {
  connection
};