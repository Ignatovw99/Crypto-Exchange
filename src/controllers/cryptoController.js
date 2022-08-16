const router = require('express').Router();
const { validationResult } = require('express-validator');

const cryptoService = require('../services/cryptoService');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { preloadCrypto, canBuyCrypto, isOwnerOfCrypto } = require('../middlewares/cryptoMiddleware');
const { createError, configError } = require('../utils/errorHelpers');
const { cryptoValidator } = require('../validators/cryptoValidator');


router.get('/', async (req, res) => {
    const cryptos = await cryptoService.getAll();
    res.render('crypto/catalog', { cryptos });
});

router.get('/search', async (req, res) => {
    const cryptos = await cryptoService.getAll(req.query);
    res.render('crypto/search', { cryptos, ...req.query });
});

router.get('/:cryptoId/details', async (req, res, next) => {
    try {
        const crypto = await cryptoService.getOne(req.params.cryptoId);
        const isOwner = cryptoService.isOwnerOfCrypto(crypto.owner, req.user);
        const isBoughtByUser = cryptoService.isBoughtByUser(crypto.buyers, req.user);
        res.render('crypto/details', { ...crypto, isOwner, isBoughtByUser });
    } catch (error) {
        next(createError());
    }
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('crypto/create');
});

router.post('/create', isAuthenticated, cryptoValidator, async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        configError(errors, 400, 'crypto/create', req.body);
        return next(errors);
    }

    const cryptoData = { ...req.body, owner: req.user._id };
    try {
        await cryptoService.create(cryptoData);
        res.redirect('/cryptos');
    } catch (error) {
        configError(error, 400, 'crypto/create', req.body);
        return next(error);
    }
});

router.get('/:cryptoId/update', isAuthenticated, preloadCrypto, isOwnerOfCrypto, async (req, res) => {
    res.render('crypto/edit', { ...req.crypto });
});

router.post('/:cryptoId/update', isAuthenticated, cryptoValidator, preloadCrypto, isOwnerOfCrypto,  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        configError(errors, 400, 'crypto/create', req.body);
        return next(errors);
    }

    try {
        await cryptoService.update(req.params.cryptoId, req.body);
        res.redirect(`/cryptos/${req.params.cryptoId}/details`);
    } catch (error) {
        configError(error, 400, 'publication/edit', req.body);
        return next(error);
    }
});

router.get('/:cryptoId/delete', isAuthenticated, preloadCrypto, isOwnerOfCrypto, async (req, res) => {
    try {
        await cryptoService.delete(req.params.cryptoId);
        res.redirect('/cryptos');
    } catch (error) {
        next(createError());
    }
});

router.get('/:cryptoId/buy', isAuthenticated, preloadCrypto, canBuyCrypto, async (req, res, next) => {

    try {
        await cryptoService.buyCryptoByUser(req.params.cryptoId, req.user);
        res.redirect(`/cryptos/${req.params.cryptoId}/details`);
    } catch (error) {
        return next(createError(error, 401));
    }
});

module.exports = router;
