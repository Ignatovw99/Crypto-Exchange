const { checkSchema } = require('express-validator');

const registerValidatorSchema = checkSchema({
    username: {
        isLength: {
            options: { min: 5 },
            errorMessage: 'Username should be at least five chars long'
        }
    },
    email: {
        isLength: {
            options: { min: 10 },
            errorMessage: 'Email should be at least ten chars long'
        },
        isEmail: {
            bail: true,
            errorMessage: 'Ivalid email format'
        }
    },
    password: {
        isLength: {
            options: { min: 3 },
            errorMessage: 'Password should be at least four chars long'
        },
        custom: {
            options: (value, { req }) => {
                return value === req.body.repeatPassword;
            },
            errorMessage: 'Password missmatch'
        }
    }
});

exports.registerUserValidator = registerValidatorSchema;