const { validationResult } = require('express-validator');

const authService = require('../services/authService');
const { StateValidationError } = require('../errors');

const loginPage = (req, res) => {
    res.render('auth/login');
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.login(email, password);
    const authorizationToken = await authService.generateAuthorizationToken(user);

    res.authorizationTokenCookie(authorizationToken);
    res.redirect('/');
};

const registerPage = (req, res) => {
    res.render('auth/register');
};

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new StateValidationError(errors.errors);
    }

    await authService.register(req.body);
    res.redirect('/');
};

const logout = (req, res) => {
    res.clearAuthorizationCookie();
    res.redirect('/');
};

module.exports = {
    loginPage,
    login,
    registerPage,
    register,
    logout
};
