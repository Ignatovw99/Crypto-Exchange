const { checkSchema } = require('express-validator');

const cryptoValidatorSchema = checkSchema({
    name: {
        isLength: {
            options: { min: 2 },
            errorMessage: 'Name should be at least two characters'
        }
    },
    image: {
        custom: {
            options: (value) => {
                return value.startsWith('http://') || value.startsWith('https://');
            },
            errorMessage: 'Crypto Image should start with http:// or https://'
        }
    },
    price: {
        custom: {
            options: (value) => {
                return value > 0;
            },
            errorMessage: 'Price should be possitive number'
        },
        isInt: true
    },
    description: {
        isLength: {
            options: { min: 10 },
            errorMessage: 'Description should be a minimum of 10 characters long'
        }
    }
});

exports.cryptoValidator = cryptoValidatorSchema;