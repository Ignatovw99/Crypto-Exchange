const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { SECRET } = require('../config/env');

exports.create = (userData) => User.create(userData);

exports.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw 'Invalid username or password';
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw 'Invalid username or password';
    }

    return user;
};

exports.generateAuthToken = (user) => {  
    const payload = { _id: user._id, username: user.username, email: user.email };
    const options = { expiresIn: '2d' };

    const tokenPromise = new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET, options, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
    
    return tokenPromise;
};
