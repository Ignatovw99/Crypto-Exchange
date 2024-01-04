const { replacePlaceholders } = require('../utils');

class InvalidStateError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    static throwError(messageTemplate, replacements) {
        const message = replacePlaceholders(messageTemplate, replacements);
        throw new InvalidStateError(message);
    }
}

module.exports = InvalidStateError;
