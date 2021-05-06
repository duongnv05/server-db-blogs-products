const { isEmpty } = require('lodash');

const getErrorFromCode = require('../constants/ErrorMessages');
const response = require('../utils/response');

const { validateUrl } = require('../utils/validation');

exports.validateInputBeforeCreateCatBlog = function(req, res, next) {
    const { name, url } = req.body;

    if(isEmpty(name) || isEmpty(url)) {
        response({ res, data: getErrorFromCode(2) });
        return;
    }

    if(!validateUrl(url)) {
        response({ res, data: getErrorFromCode(1502) });
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
            return response({ res, data: getErrorFromCode(2) });
        }
    
    req.body.app_id = req.query.sign;
    next();
}