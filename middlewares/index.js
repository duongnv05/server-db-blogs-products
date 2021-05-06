const { isEmpty } = require('lodash');

const getError = require('../constants/ErrorMessages');

const response = require('../utils/response');

exports.validateInputAppId = (req, res, next) => {
    const { sign } = req.query;

    if(isEmpty(sign)) {
        return response({ res, data: getError(14) });
    }

    next();
}