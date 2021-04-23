const { isEmpty } = require('lodash');
const response = require('../utils/response');

const getError = require('../constants/ErrorMessages');

module.exports = (req, res, next) => {
    const { app_id, origin } = req.query;

    if((typeof app_id === undefined || app_id === null || isEmpty(app_id))
        && (typeof origin === undefined || origin === null || isEmpty(origin))) {
            response({ res, data: getError(14) })
            return;
        }

    next();
}