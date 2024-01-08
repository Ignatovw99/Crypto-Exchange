const cryptoService = require('../services/cryptoService');
const { ForbiddenError } = require('../errors');
const {
    NOT_AUTHORIZED,
    CRYPTO_OWNER_CANNOT_BUY,
    CRYPTO_ALREADY_BOUGHT_BY_USER
} = require('../errors/errorConstants');

exports.preloadCrypto = async (req, res, next) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId);
    req.crypto = crypto;
    return next();
};

exports.isOwnerOfCrypto = (req, res, next) => {
    const isOwner = cryptoService.isOwnerOfCrypto(req.crypto.owner, req.user);
    if (!isOwner) {
        const error = new ForbiddenError(NOT_AUTHORIZED);
        return next(error);
    }
    next();
};

exports.canBuyCrypto = (req, res, next) => {
    const isOwner = cryptoService.isOwnerOfCrypto(req.crypto.owner, req.user);
    if (isOwner) {
        return next(new ForbiddenError(CRYPTO_OWNER_CANNOT_BUY));
    }

    const isBoughtByUser = cryptoService.isBoughtByUser(req.crypto.buyers, req.user);
    if (isBoughtByUser) {
        const errorData = {
            name: req.crypto.name,
            username: req.user.username
        }
        return next(ForbiddenError.createError(CRYPTO_ALREADY_BOUGHT_BY_USER, errorData));
    }
    next();
}
