const express = require('express');

const homeController = require('../controllers/homeController');
const authRouter = require('./authRouter');
const cryptoRouter = require('./cryptoRouter');

const router = express.Router();

router.get('/', homeController.homePage);
router.use('/auth', authRouter);
router.use('/cryptos', cryptoRouter);

module.exports = router;
