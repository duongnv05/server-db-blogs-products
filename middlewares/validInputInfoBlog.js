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
            const { short_description } = req.body;
            if(isEmpty(short_description) || short_description.length < 50) {
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
            const { date_released } = req.body;
            if(typeof date_released !== "undefined"
            && date_released !== null && date_released !== "") {
                req.body.date_released = Number(req.body.date_released);
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
        },
        appId: cb => {
            const { sign } = req.query;
            if(isEmpty(sign)) {
                cb(getErrorFromCode(2));
            } else {
                req.body.app_id = sign;
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

exports.validInputBlogToUpdate = (req, res, next) => {
    async.parallel({
        _id: cb => {
            const { _id } = req.body;
            if(isEmpty(_id)) {
                cb(getErrorFromCode(1008));
            } else {
                cb(null);
            }
        },
        shortDescription: cb => {
            const { short_description } = req.body;
            if(short_description && short_description.length < 50) {
                cb(getErrorFromCode(1002));
            } else {
                cb(null);
            }
        },
        content: cb => {
            const { content } = req.body;
            if(content && content.length < 250) {
                cb(getErrorFromCode(1003));
            } else {
                cb(null);
            }
        },
        dateReleased: cb => {
            const { date_released } = req.body;
            if(date_released) {
                req.body.date_released = Number(req.body.date_released);
            } 
            cb(null);
        },
        actors: cb => {
            const { actors } = req.body;
            if(actors && !isArray(actors)) {
                cb(getErrorFromCode(1005));
            } else {
                cb(null);
            }
        },
        tags: cb => {
            const { tags } = req.body;
            console.log(tags)
            if(tags && !isArray(tags)) {
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