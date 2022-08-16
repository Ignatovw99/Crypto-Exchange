const mongoose = require('mongoose');

const { DB_CONNECTION_STRING } = require('./env');

mongoose.connection.on('open', () => console.log('The app is connected to the database'));

exports.initializeDatabase = () => mongoose.connect(DB_CONNECTION_STRING);
