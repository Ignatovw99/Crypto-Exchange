const { replacePlaceholders } = require('../utils');

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    static createError(messageTemplate, replacements) {
        const message = replacePlaceholders(messageTemplate, replacements);
        return new ForbiddenError(message);
    }

    static throwError(messageTemplate, replacements) {
        throw ForbiddenError.createError(messageTemplate, replacements);
    }
}

module.exports = ForbiddenError;