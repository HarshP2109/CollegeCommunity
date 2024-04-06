const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const tashSchema = new mongoose.Schema({
    FromID: String,   //UniqueId
    FromName: String,   //Username
    ToID: String,      //UniqueID
    ToName: String,    //Username
    Message: String,     
    Deadline: String,
    Status: String
});

const task = mainData.model('Tasks', tashSchema);

module.exports = {
  task
};