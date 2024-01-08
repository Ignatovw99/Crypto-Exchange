const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { saltRounds } = require('../config/properties').auth;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, saltRounds)
        .then((hashedPassword) => {
            this.password = hashedPassword;
            next();
        });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
