const mongoose = require('mongoose');
const { chat } = require ('../config/mongoose.js')

const messageSchema = new mongoose.Schema({
    FromUser: String ,
    FromID: String ,
    ToUser: String ,
    ToID: String,
    Connection: String ,
    Message: String,
    Time: String
});


module.exports = {
  messageSchema
};