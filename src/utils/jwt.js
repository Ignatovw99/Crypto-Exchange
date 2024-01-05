const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');

exports.verify = promisify(jwt.verify);
exports.sign = promisify(jwt.sign);
