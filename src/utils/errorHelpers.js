const handleDataModelDuplicationError = (err) => {
    err.status = 409;
    err.message = `already exists`;
}

const handleBindingValidationError = err => {
    err.status = 400;
    err.message = err.errors[0].msg;
}

exports.createError = (message, status, page, data) => {
    return {
        message, status, page, data
    };
};

exports.configError = (error, status, page, data) => {
    const options = {
        status, page, data
    };
    Object.assign(error, options);
}

exports.normalizeError = (err) => {
    //Validation errors from mongoose
    if (err.name) {
        let errorName = err.name;
        if ('ValidationError' === errorName) {
            handleDataModelValidationError(err);
        } else if ('MongoServerError' === errorName) {
            handleDataModelDuplicationError(err);
        }
    //Validation errors from validation binding
    } else if (err.errors) {
        handleBindingValidationError(err);
    }

    return err;
};
