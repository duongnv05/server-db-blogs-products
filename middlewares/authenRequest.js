const { isEmpty } = require('lodash');
const response = require('../utils/response');

const getError = require('../constants/ErrorMessages');

module.exports = (req, res, next) => {
    const { sign, origin } = req.query;

    if((typeof sign === undefined || sign === null || isEmpty(sign))
        && (typeof origin === undefined || origin === null || isEmpty(origin))) {
            response({ res, data: getError(14) })
            return;
        }

    next();
}