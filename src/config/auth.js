module.exports = {
    saltRounds: process.env.SALT_ROUNDS || 10,
    secret: process.env.SECRET || 'somerandomsecret'
};
