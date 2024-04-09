const mongoose = require('mongoose');
const { mainData } = require ('../config/mongoose.js')

const activitySchema = new mongoose.Schema({
    Username: String ,
    UniqueId: String,
    Date1: Date,
    DateActive1: Number,
    Date2: Date,
    DateActive2: Number,
    Date3: Date,
    DateActive3: Number,
    Date4: Date,
    DateActive4: Number,
    Date5: Date,
    DateActive5: Number,
    Date6: Date,
    DateActive6: Number,
    Date7: Date,
    DateActive7: Number
});

const dailyData = mainData.model('Activity', activitySchema);

module.exports = {
    dailyData
};