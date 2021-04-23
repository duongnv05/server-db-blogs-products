const { isEmpty } = require('lodash');

const getError = require('../constants/ErrorMessages');

const response = require('../utils/response');

exports.validateInputAppId = (req, res, next) => {
    const { app_id } = req.query;

    if(isEmpty(app_id)) {
        return response({ res, data: getError(14) });
    }

    next();
}