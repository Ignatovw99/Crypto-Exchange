module.exports = {
    server: {
        port: process.env.PORT || 3000,
    },
    database: {
        url: process.env.DATABASE_CONNECTION_URL || 'mongodb://localhost:27017/crypto-exchange-db'
    },
    auth: {
        saltRounds: process.env.SALT_ROUNDS || 10,
        secret: process.env.SECRET || 'somerandomsecret'
    },
    web: {
        cookieSessionName: 'user'
    }
};
