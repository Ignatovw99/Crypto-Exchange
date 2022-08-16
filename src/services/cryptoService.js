const Crypto = require('../models/Crypto');

exports.create = (cryptoData) => Crypto.create(cryptoData);

exports.update = (cryptoId, cryptoData) => Crypto.updateOne({ _id: cryptoId }, { ...cryptoData }, { runValidators: true });

exports.delete = (cryptoId) => Crypto.deleteOne({ _id: cryptoId });

const getQueryResult = (query) => {
    const queryResult = {};
    if (query.name && query.name != '') {
        queryResult.name = { $regex: new RegExp(query.name, 'i') };
    }
    if (query.paymentMethod) {
        queryResult.paymentMethod = { $regex: new RegExp(query.paymentMethod, 'i') };
    }
    return queryResult;
}

exports.getAll = (query = {}) => {
    const queryResult = getQueryResult(query);
    return Crypto.find(queryResult).lean();
}

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();

exports.isOwnerOfCrypto = (cryptoOwner, user) => user ? cryptoOwner == user._id : false;

exports.isBoughtByUser = (cryptoBuyers, user) => user ? cryptoBuyers.map(buyerId => buyerId.toString()).includes(user._id) : false;

exports.buyCryptoByUser = async (cryptoId, user) => {
    const crypto = await Crypto.findById(cryptoId);
    crypto.buyers.push(user._id);
    return crypto.save();
}
