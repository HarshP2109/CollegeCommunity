const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const participantSchema = new mongoose.Schema({
  EventTitle : String,
  Venue : String,
  RegistrationTime : Date,
  Organisation: String,
  EventID: String,
  UserID: String,
  UserName: String,
  Email: String,
  ContactNo: String,
  By:String
});

const participant = mainData.model('Participation', participantSchema);

module.exports = {
  participant
};