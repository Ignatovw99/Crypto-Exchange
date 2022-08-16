const cryptoService = require('../services/cryptoService');
const { createError } = require('../utils/errorHelpers');

exports.preloadCrypto = async (req, res, next) => {
    try {
        const crypto = await cryptoService.getOne(req.params.cryptoId);
        req.crypto = crypto;
        return next();
    } catch(error) {
        return next(createError());
    }
};

exports.isOwnerOfCrypto = (req, res, next) => {
    const isOwner = cryptoService.isOwnerOfCrypto(req.crypto.owner, req.user);
    if (!isOwner) {
        return next(createError('You are not authorized!'), 401);
    }
    next();
};

exports.canBuyCrypto = (req, res, next) => {
    const isOwner = cryptoService.isOwnerOfCrypto(req.crypto.owner, req.user);
    if (isOwner) {
        return next(createError('You are the owner of these crypto coins. You cannot buy.'), 400);
    }
    const isBoughtByUser = cryptoService.isBoughtByUser(req.crypto.buyers, req.user);
    if (isBoughtByUser) {
        return next(createError('You already bought these crypto coins.'), 400);
    }
    next();
}
