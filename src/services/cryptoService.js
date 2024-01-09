const cryptoRepository = require('../repositories/cryptoRepository');
const userRepository = require('../repositories/userRepository');

const { InvalidStateError, NotFoundError, AlreadyExistError } = require('../errors');
const {
    CRYPTO_WITH_NAME_ALREDY_EXISTS,
    USER_NOT_FOUND,
    CRYPTO_NOT_FOUND,
    CRYPTO_ALREADY_BOUGHT_BY_USER
} = require('../errors/errorConstants');

const create = async (cryptoData, userId) => {
    const crypto = await cryptoRepository.findByName(cryptoData.name);
    if (crypto) {
        AlreadyExistError.throwError(CRYPTO_WITH_NAME_ALREDY_EXISTS, { name: cryptoData.name });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
        throw new InvalidStateError(USER_NOT_FOUND);
    }

    return cryptoRepository.create({ ...cryptoData, owner: user._id });
};

const update = async (cryptoId, cryptoData) => {
    const existingCrypto = await cryptoRepository.existsAnotherCryptoWithName(cryptoId, cryptoData.name);
    if (existingCrypto) {
        AlreadyExistError.throwError(CRYPTO_WITH_NAME_ALREDY_EXISTS, { name: cryptoData.name });
    }

    const updatedCrypto = await cryptoRepository.updateById(cryptoId, cryptoData);
    if (!updatedCrypto) {
        throw new NotFoundError(CRYPTO_NOT_FOUND);
    }
    
    return updatedCrypto;
};

const deleteCrypto = async (cryptoId) => {
    const deletedCrypto = await cryptoRepository.deleteById(cryptoId);
    if (!deletedCrypto) {
        throw new NotFoundError(CRYPTO_NOT_FOUND);
    }
};

const getAll = async (query = {}) => cryptoRepository.findAllBySearchCriteria(query);

const getOne = async (cryptoId) => {
    const crypto = await cryptoRepository.findById(cryptoId);
    if (!crypto) {
        throw new NotFoundError(CRYPTO_NOT_FOUND);
    }
    return crypto;
};

const isOwnerOfCrypto = (cryptoOwner, user) => user && cryptoOwner == user._id;

const isBoughtByUser = (cryptoBuyers, user) => user && cryptoBuyers.map(buyerId => buyerId.toString()).includes(user._id);

const buyCryptoByUser = async (cryptoId, user) => {
    const crypto = await getOne(cryptoId);
    if (isBoughtByUser(crypto.buyers, user)) {
        InvalidStateError.throwError(
            CRYPTO_ALREADY_BOUGHT_BY_USER,
            { name: crypto.name, username: user.username }
        );
    }

    return cryptoRepository.addBuyerToCrypto(cryptoId, user._id);
};

module.exports = {
    create,
    update,
    deleteCrypto,
    getAll,
    getOne,
    isOwnerOfCrypto,
    isBoughtByUser,
    buyCryptoByUser
};
