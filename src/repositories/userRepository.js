const User = require('../models/User');

const create = async (user) => {
    const userModel = await User.create(user);
    return userModel.toObject();
};

const findByEmail = async (email) => {
    return User.findOne({ email }).lean();
};

const findById = async (id) => {
    return User.findById(id).lean();
};

module.exports = {
    create,
    findByEmail,
    findById
};
