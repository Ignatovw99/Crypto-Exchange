const mongoose = require('mongoose');

const { database } = require('./config');

mongoose.connection.on('open', () => console.log('The app is connected to the database'));

exports.connectDatabase = () => mongoose.connect(database.url);
