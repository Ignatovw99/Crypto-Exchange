class StateValidationError extends Error {
    constructor(errors) {
        super();
        this.errors = errors;
        this.name = this.constructor.name;
    }
}

module.exports = StateValidationError;
