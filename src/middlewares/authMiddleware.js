const jwt = require('jsonwebtoken');

const { secret } = require('../config/properties').auth;
const { cookieSessionName } = require('../config/properties').web;

exports.attachAuthCookieFunctions = (req, res, next) => {
    const authorizationTokenCookie = (token) => res.cookie(cookieSessionName, token, { httpOnly: true });
    const clearAuthorizationCookie = () => res.clearCookie(cookieSessionName);

    res.authorizationTokenCookie = authorizationTokenCookie;
    res.clearAuthorizationCookie = clearAuthorizationCookie;

    next();
};

exports.authenticate = (req, res, next) => {
    const authToken = req.cookies[cookieSessionName];

    if (authToken) {
        jwt.verify(authToken, secret, (err, user) => {
            if (err) {
                res.clearCookie(cookieSessionName);
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
