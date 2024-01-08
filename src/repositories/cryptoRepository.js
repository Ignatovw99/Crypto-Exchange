const Crypto = require('../models/Crypto');

const create = async (cryptoData) => {
    const cryptoDocument = await Crypto.create(cryptoData);
    return cryptoDocument.toObject({ virtuals: true });
};

const findById = async (id) => {
    return Crypto.findById(id).lean();
};

const findByName = async (name) => {
    return Crypto.findOne({ name }).lean();
};

const findAllBySearchCriteria = async (criteria) => {
    const searchableFields = Crypto.getStringFields();

    const searchQuery = Object.entries(criteria)
        .filter(([field, value]) => value && searchableFields.includes(field))
        .reduce((queryAcc, [field, value]) => {
            queryAcc[field] = { $regex: new RegExp(value, 'i') };
            return queryAcc;
        }, {});

    return Crypto.find(searchQuery).lean();
};

const existsAnotherCryptoWithName = async (cryptoId, name) => {
    const existingCrypto = await Crypto.findOne({ name, _id: { $ne: cryptoId } }).lean();
    return !!existingCrypto;
};

const updateById = async (id, cryptoData) => {
    return Crypto.findByIdAndUpdate(
        id,
        { $set: cryptoData },
        { new: true, runValidators: true }
    ).lean({ virtuals: true });
};

const deleteById = async (id) => {
    return Crypto.findByIdAndDelete(id).lean();
};

const addBuyerToCrypto = async (id, buyerId) => {
    return Crypto.findByIdAndUpdate(
        id,
        { $push: { buyers: buyerId } },
        { new: true, runValidators: true }
    ).lean({ virtuals: true });
};

module.exports = {
    create,
    findById,
    findByName,
    findAllBySearchCriteria,
    existsAnotherCryptoWithName,
    updateById,
    deleteById,
    addBuyerToCrypto
};
