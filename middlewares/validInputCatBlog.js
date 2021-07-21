const { isEmpty, isArray } = require('lodash');

const getError = require('../constants/ErrorMessages');
const response = require('../utils/response');

const { validateUrl } = require('../utils/validation');

exports.validateInputBeforeCreateCatBlog = function(req, res, next) {
    const { name, url } = req.body;

    if(isEmpty(name) || isEmpty(url)) {
        response({ res, data: getError(2)(2) });
        return;
    }

    if(!validateUrl(url)) {
        response({ res, data: getError(2)(1502) });
        return;
    }

    req.body.app_id = req.query.sign;
    next();
}

exports.validateInputBeforeUpdateCatBlog = function(req, res, next) {
    const { name, url, _id } = req.body;

    if((typeof name !== "undefined" && isEmpty(name))
        || (typeof url !== "undefined" && isEmpty(url))
        || isEmpty(_id)) {
            return response({ res, data: getError(2)(2) });
        }
    
    req.body.app_id = req.query.sign;
    next();
}

exports.validInputBeforeSearchCatBlog = (req, res, next) => {
    const { name } = req.body;

    if(isEmpty(name)) {
        return response({ res, data: getError(2) });
    }

    next();
}

exports.validInputIdsGetCatBlog = (req, res, next) => {
    const { list_id } = req.body;

    if(isEmpty(list_id) || !isArray(list_id)) {
        return response({ res, data: getError(2) });
    }

    next();
}