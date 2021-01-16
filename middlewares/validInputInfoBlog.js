const { isEmpty, isArray } = require('lodash');
const async = require('async');

const getErrorFromCode = require('../constants/ErrorMessages');
const response = require('../utils/response');

exports.validInputBlog = (req, res, next) => {
    if(isEmpty(req.body)) {
        return response({ res, data: getErrorFromCode(2) });
    }

    async.parallel({
        title: cb => {
            const { title } = req.body;
            if(isEmpty(title)) {
                cb(getErrorFromCode(1001));
            } else {
                cb(null);
            }
        },
        shortDescription: cb => {
            const { shortDescription } = req.body;
            if(isEmpty(shortDescription) || shortDescription.length < 50) {
                cb(getErrorFromCode(1002));
            } else {
                cb(null);
            }
        },
        content: cb => {
            const { content } = req.body;
            if(isEmpty(content) || content.length < 250) {
                cb(getErrorFromCode(1003));
            } else {
                cb(null);
            }
        },
        dateReleased: cb => {
            const { dateReleased } = req.body;
            if(typeof dateReleased !== "undefined"
            && dateReleased !== null && dateReleased !== "") {
                cb(null);
            } else {
                cb(getErrorFromCode(1004));
            }
        },
        actors: cb => {
            const { actors } = req.body;
            if(isEmpty(actors) || !isArray(actors)) {
                cb(getErrorFromCode(1005));
            } else {
                cb(null);
            }
        },
        tags: cb => {
            const { tags } = req.body;
            if(isEmpty(tags) || !isArray(tags)) {
                cb(getErrorFromCode(1006));
            } else {
                cb(null);
            }
        }
    }, (error) => {
        if(!error) {

            next();
        } else {
            response({ res, data: error });
        }
    })
}