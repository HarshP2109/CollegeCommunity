const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const groupSchema = new mongoose.Schema({
    GroupName: String,
    GroupID: String, 
    Domain: String, 
    Admin: String, 
    Members: [{ type: String }]
});

// groupSchema.index({ GroupName: 1 }, { unique: true });

const groupData = mainData.model('Group', groupSchema);

module.exports = {
  groupData
};