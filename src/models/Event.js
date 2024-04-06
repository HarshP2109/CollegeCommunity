const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const eventSchema = new mongoose.Schema({
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

const eventData = mainData.model('Events', eventSchema);

module.exports = {
  eventData
};