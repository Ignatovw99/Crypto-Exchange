const mongoose = require('mongoose');

const { url } = require('./properties').database;

mongoose.connection.on('open', () => console.log('The app is connected to the database'));

exports.connectDatabase = async () => await mongoose.connect(url);
