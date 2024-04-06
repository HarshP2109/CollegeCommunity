const mongoose = require('mongoose');
const { chat } = require ('../config/mongoose.js')

const groupSchema = new mongoose.Schema({
    GroupName: String,
    GroupID: String, 
    Domain: String, 
    Admin: String, 
    Members: String
});

const groupData = chat.model('Group', groupSchema);

module.exports = {
  groupData
};