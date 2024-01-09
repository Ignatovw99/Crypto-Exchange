const { validationResult } = require('express-validator');

const cryptoService = require('../services/cryptoService');
const { StateValidationError } = require('../errors');

const getAll = async (req, res) => {
    const cryptos = await cryptoService.getAll();
    res.render('crypto/catalog', { cryptos });
};

const searchCryptos = async (req, res) => {
    const cryptos = await cryptoService.getAll(req.query);
    res.render('crypto/search', { cryptos, ...req.query });
};

const getCryptoDetails = async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId);
    const isOwner = cryptoService.isOwnerOfCrypto(crypto.owner, req.user);
    const isBoughtByUser = cryptoService.isBoughtByUser(crypto.buyers, req.user);

    res.render('crypto/details', { ...crypto, isOwner, isBoughtByUser });
};

const createCryptoPage = (req, res) => {
    res.render('crypto/create');
};

const createCrypto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new StateValidationError(errors.errors);
    }

    await cryptoService.create(req.body, req.user._id);
    res.redirect('/cryptos');
};

const updateCryptoPage = (req, res) => {
    res.render('crypto/edit', { ...req.crypto });
};

const updateCrypto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new StateValidationError(errors.errors);
    }

    await cryptoService.update(req.params.cryptoId, req.body);
    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
};

const deleteCtypto = async (req, res) => {
    await cryptoService.deleteCrypto(req.params.cryptoId);
    res.redirect('/cryptos');
};

const buyCrypto = async (req, res) => {
    await cryptoService.buyCryptoByUser(req.params.cryptoId, req.user);
    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
};

module.exports = {
    getAll,
    searchCryptos,
    getCryptoDetails,
    createCryptoPage,
    createCrypto,
    updateCryptoPage,
    updateCrypto,
    deleteCtypto,
    buyCrypto
};
