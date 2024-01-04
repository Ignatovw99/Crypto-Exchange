const { replacePlaceholders } = require('../utils');

class AlreadyExistError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    static throwError(messageTemplate, replacements) {
        const message = replacePlaceholders(messageTemplate, replacements);
        throw new AlreadyExistError(message);
    }
}

module.exports = AlreadyExistError;
