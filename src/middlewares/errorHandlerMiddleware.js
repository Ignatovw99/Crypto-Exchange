const { normalizeError } = require('../utils/errorHelpers');

exports.errorHandler = (err, req, res, next) => {
    err = normalizeError(err);

    const status = err.status || 404;
    const page = err.page || '404';
    const message = err.message || "Not found";
    const data = err.data || {};

    res.status(status).render(page, { error: message, ...data });
};
