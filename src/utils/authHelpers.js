const { COOKIE_SESSION_NAME } = require('../constants');

exports.setAuthTokenAsCookie = (res, token) => {
    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
};

exports.clearAuthCookie = (res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
};
