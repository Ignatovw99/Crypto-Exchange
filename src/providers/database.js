const mongoose = require('mongoose');

const { url } = require('../config/database');

mongoose.connection.on('open', () => console.log('The app is connected to the database'));

exports.connectDatabase = () => mongoose.connect(url);
