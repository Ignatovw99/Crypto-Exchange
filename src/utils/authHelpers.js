const { web: { cookieSessionName } } = require('../config/config');

exports.setAuthTokenAsCookie = (res, token) => {
    res.cookie(cookieSessionName, token, { httpOnly: true });
};

exports.clearAuthCookie = (res) => {
    res.clearCookie(cookieSessionName);
};
