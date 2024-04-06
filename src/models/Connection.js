const mongoose = require('mongoose');
const { chat } = require ('../config/mongoose.js')

const connectSchema = new mongoose.Schema({
    FromUser: String ,
    FromID: String ,
    ToUser: String ,
    ToID: String,
    Connection: String 
});

const connection = chat.model('Connections', connectSchema);

module.exports = {
  connection
};