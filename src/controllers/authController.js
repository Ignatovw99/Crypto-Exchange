const router = require('express').Router();
const { validationResult } = require('express-validator');

const authService = require('../services/authService');
const { registerUserValidator } = require('../validators/userValidator');
const { isAuthenticated, isGuest } = require('../middlewares/authMiddleware');
const { setAuthTokenAsCookie, clearAuthCookie } = require('../utils/authHelpers');
const { createError, configError } = require('../utils/errorHelpers');


router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        const authToken = await authService.generateAuthToken(user);
        setAuthTokenAsCookie(res, authToken);
        res.redirect('/');
    } catch (error) {
        next(createError(error, 400, 'auth/login'));
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, registerUserValidator, async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        configError(errors, 400, 'auth/register', req.body);
        return next(errors);
    }

    try {
        await authService.create(req.body);
        res.redirect('/');
    } catch (error) {
        configError(error, 400, 'auth/register', req.body);
        return next(error);
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    clearAuthCookie(res);
    res.redirect('/');
});

module.exports = router;
