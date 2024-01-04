const { replacePlaceholders } = require('../utils');

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    static throwError(messageTemplate, replacements) {
        const message = replacePlaceholders(messageTemplate, replacements);
        throw new NotFoundError(message);
    }
}

module.exports = NotFoundError;
