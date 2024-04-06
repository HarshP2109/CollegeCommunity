// config/mongoose.js
const mongoose = require('mongoose');
const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const MongoURL1 = process.env.MongoDBURL1;
const MongoURL2 = process.env.MongoDBURL2;
// console.log(MongoURL1);

// Create connection to MongoDB databases
const mainData = mongoose.createConnection(MongoURL1);
const chat = mongoose.createConnection(MongoURL2);

module.exports = {
  mainData,
  chat
};
