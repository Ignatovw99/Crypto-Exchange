const express = require('express');

const authController = require('../controllers/authController');

const { isAuthenticated, isGuest, attachAuthCookieFunctions } = require('../middlewares/authMiddleware');
const { showViewOnError } = require('../middlewares/errorHandlerMiddleware');

const { registerUserValidator } = require('../validators/userValidator');

const router = express.Router();

router.use(attachAuthCookieFunctions);

router.get('/login', isGuest, authController.loginPage);
router.post('/login', isGuest, showViewOnError('auth/login'), authController.login);
router.get('/register', isGuest, authController.registerPage);
router.post('/register', isGuest, showViewOnError('auth/register'), registerUserValidator, authController.register);
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;
