const express = require('express');

const cryptoController = require('../controllers/cryptoController');

const { isAuthenticated } = require('../middlewares/authMiddleware');
const { showViewOnError } = require('../middlewares/errorHandlerMiddleware');
const { preloadCrypto, canBuyCrypto, isOwnerOfCrypto } = require('../middlewares/cryptoMiddleware');

const { cryptoValidator } = require('../validators/cryptoValidator');

const router = express.Router();

router.get('/', cryptoController.getAll);
router.get('/search',cryptoController.searchCryptos);

router.get(
    '/:cryptoId/details',
    showViewOnError("404"),
    cryptoController.getCryptoDetails
);

router.get(
    '/create',
    isAuthenticated,
    cryptoController.createCryptoPage
);

router.post(
    '/create',
    isAuthenticated,
    cryptoValidator,
    showViewOnError("crypto/create"),
    cryptoController.createCrypto
);

router.get(
    '/:cryptoId/update',
    isAuthenticated,
    preloadCrypto,
    isOwnerOfCrypto,
    cryptoController.updateCryptoPage
);

router.post(
    '/:cryptoId/update',
    isAuthenticated,
    cryptoValidator,
    preloadCrypto,
    isOwnerOfCrypto,
    showViewOnError('crypto/edit'),
    cryptoController.updateCrypto
);

router.get(
    '/:cryptoId/delete',
    isAuthenticated,
    preloadCrypto,
    isOwnerOfCrypto,
    cryptoController.deleteCtypto
);

router.get(
    '/:cryptoId/buy',
    isAuthenticated,
    preloadCrypto,
    canBuyCrypto,
    cryptoController.buyCrypto
);

module.exports = router;
