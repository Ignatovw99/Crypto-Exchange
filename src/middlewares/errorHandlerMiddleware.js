const { MongoServerError } = require('mongodb');
const { ValidationError, CastError } = require('mongoose').Error;
const {
    NotFoundError,
    InvalidStateError,
    AlreadyExistError,
    ForbiddenError,
    UnauthorizedError,
    StateValidationError
} = require('../errors');

const createError = (message, status) => {
    return {
        message, status
    };
};

const errorTypeHandlers = {
    [NotFoundError.name]: (err) => createError(err.message, 404),
    [InvalidStateError.name]: (err) => createError(err.message, 400),
    [AlreadyExistError.name]: (err) => createError(err.message, 409),
    [ForbiddenError.name]: (err) => createError(err.message, 403),
    [UnauthorizedError.name]: (err) => createError(err.message, 401),
    [ValidationError.name]: (err) => {
        const message = Object.values(err.errors)[0].message;
        return createError(message, 400);
    },
    [CastError.name]: (err) => {
        if (err.kind === 'ObjectId') {
            return createError("Invalid ID format", 400);
        }
        return createError("Invalid field value", 400);
    },
    [MongoServerError.name]: (err) => createError('Document already exists', 409),
    [StateValidationError.name]: (err) => {
        const message = err.errors[0].msg;
        return createError(message, 400);
    },
    default: (err) => createError("Server error!", 500, "404", {})
};

exports.showViewOnError = (view) => {
    return (req, res, next) => {
        res.locals.errorView = view;
        next();
    };
};

exports.errorHandler = (err, req, res, next) => {
    const errorHandler = errorTypeHandlers[err.name] || errorTypeHandlers.default;

    const { status, message } = errorHandler(err);
    const page = res.locals.errorView || '404';
    const data = req.body || {};

    res.status(status)
        .render(page, { error: message, ...data });
};
