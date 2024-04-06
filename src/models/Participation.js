const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const participantSchema = new mongoose.Schema({
    Title : String,
    Venue : String,
    St_d : Date,
    En_d :Date,
    St_t:String,
    En_t:String,
    Participant: String,
    Devfolio: String,
    img: String,
    descp: String,
    tag: String,
    Organsiation: String,
    EventID: String,
    By:String
});

const participant = mainData.model('Participation', participantSchema);

module.exports = {
  participant
};