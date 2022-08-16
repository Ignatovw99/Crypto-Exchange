const jwt = require('jsonwebtoken');

const { COOKIE_SESSION_NAME } = require('../constants');
const { SECRET } = require('../config/env');

exports.auth = (req, res, next) => {
    const authToken = req.cookies[COOKIE_SESSION_NAME];

    if (authToken) {
        jwt.verify(authToken, SECRET, (err, user) => {
            if (err) {
                res.clearCookie(COOKIE_SESSION_NAME);
                return res.redirect('/auth/login');
            }
            req.user = user;
            res.locals.user = user;
            next();
        });
    } else {
        next();
    }
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};

exports.isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
};
