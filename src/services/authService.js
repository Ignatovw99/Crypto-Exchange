const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRepositry = require('../repositories/userRepository');

const {
    UnauthorizedError,
    AlreadyExistError,
    InvalidStateError
} = require('../errors');
const {
    INVALID_CREDENTIALS,
    USER_ALREADY_EXISTS,
    PASSWORD_MISMATCH
} = require('../errors/errorConstants');

const { secret } = require('../config/auth');

const register = async (user) => {
    const { email, password, repeatPassword } = user;

    const existingUser = await userRepositry.findByEmail(email);
    if (existingUser) {
        AlreadyExistError.throwError(USER_ALREADY_EXISTS, { email });
    }

    if (!password || password !== repeatPassword) {
        throw new InvalidStateError(PASSWORD_MISMATCH);
    }

    return userRepositry.create(user);
};

const login = async (email, password) => {
    const user = await userRepositry.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    return user;
};

const generateAuthorizationToken = async (user) => {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    };
    const options = { expiresIn: '2d' };

    const tokenSigningPromise = new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });

    return tokenSigningPromise;
};

module.exports = {
    login,
    register,
    generateAuthorizationToken
};
