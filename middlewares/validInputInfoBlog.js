const { isEmpty, isArray, isNumber } = require('lodash');
const async = require('async');

const getError = require('../constants/ErrorMessages');
const response = require('../utils/response');
const { statusModel } = require('../constants/Global');
const { statusBlog } = require('../constants/Blog');

exports.validInputBlog = (req, res, next) => {
    if(isEmpty(req.body)) {
        return response({ res, data: getError(2) });
    }

    async.parallel({
        title: cb => {
            const { title } = req.body;
            if(isEmpty(title)) {
                cb(getError(1001));
            } else {
                cb(null);
            }
        },
        shortDescription: cb => {
            const { short_description } = req.body;
            console.log(short_description.length)
            if(short_description === "" || short_description.length > 500) {
                cb(getError(1002));
            } else {
                cb(null);
            }
        },
        content: cb => {
            const { content } = req.body;
            if(isEmpty(content) || content.length < 250) {
                cb(getError(1003));
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
                cb(getError(1004));
            }
        },
        actors: cb => {
            const { actors } = req.body;
            if(isEmpty(actors) || !isArray(actors)) {
                cb(getError(1005));
            } else {
                cb(null);
            }
        },
        tags: cb => {
            const { tags } = req.body;
            if(isEmpty(tags) || !isArray(tags)) {
                cb(getError(1006));
            } else {
                cb(null);
            }
        },
        appId: cb => {
            const { sign } = req.query;
            if(isEmpty(sign)) {
                cb(getError(2));
            } else {
                req.body.app_id = sign;
                cb(null);
            }
        },
        categories_blog_id: cb => {
            const { categories_blog_id } = req.body;
            if(
                typeof categories_blog_id !== "undefined"
                && !isArray(categories_blog_id)
            ) {
                cb(getError(1010));
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

exports.validInputBlogToUpdate = (req, res, next) => {
    async.parallel({
        _id: cb => {
            const { _id } = req.body;
            if(isEmpty(_id)) {
                cb(getError(5000));
            } else {
                cb(null);
            }
        },
        shortDescription: cb => {
            const { short_description } = req.body;
            if(short_description && short_description.length < 50) {
                cb(getError(1002));
            } else {
                cb(null);
            }
        },
        content: cb => {
            const { content } = req.body;
            if(content && content.length < 250) {
                cb(getError(1003));
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
                cb(getError(1005));
            } else {
                cb(null);
            }
        },
        tags: cb => {
            const { tags } = req.body;
            if(tags && !isArray(tags)) {
                cb(getError(1006));
            } else {
                cb(null);
            }
        },
        categories_blog_id: cb => {
            const { categories_blog_id } = req.body;
            if(
                typeof categories_blog_id !== "undefined"
                && !isArray(categories_blog_id)
            ) {
                cb(getError(1010));
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

exports.validInputGetBlogsClient = (req, res, next) => {
    async.parallel({
        sign: (cb) => {
            const { sign } = req.query;
            if(!sign) {
                cb(true);
            } else {
                cb(null);
            }
        },
        limit: (cb) => {
            const { limit } = req.query;
            if(typeof limit === "undefined" || !isNumber(Number(limit))) {
                req.query.limit = 0;
            }

            cb(null, null);
        },
        skip: (cb) => {
            const { skip } = req.query;
            if(typeof skip === "undefined" || !isNumber(Number(skip))) {
                req.query.skip = 0;
            }

            cb(null, null);
        },

    }, (error) => {
        if(error) {
            return response({ res, data: getError(2) })
        }
        const now = Date.now();

        req.query.query = {};
        req.query.query.status = statusModel.ENABLED;
        req.query.query.status_approved = statusBlog.APPROVED;
        req.query.query.date_released = { $lte: now };
        
        next();
    });
};

exports.validInputGetBlogWithCatBlogId = (req, res, next) => {
    async.parallel({
        sign: (cb) => {
            const { sign } = req.query;
            
            if(!sign) {
                cb(true);
            } else {
                cb(null);
            }
        },
        categoryBlogId: (cb) => {
            const { categoryBlogId } = req.query;

            if(categoryBlogId && categoryBlogId !== "") {
                cb(null);
            } else {
                cb(true);
            }
        }
    }, error => {
        if(error) {
            return response({ res, data: getError(1503) })
        }

        const now = Date.now();

        const { categoryBlogId } = req.query;
        
        req.query.query = {};
        req.query.query.status = statusModel.ENABLED;
        req.query.query.status_approved = statusBlog.APPROVED;
        req.query.query.date_released = { $lte: now };
        req.query.query.categories_blog_id = categoryBlogId

        next()
    })
}

exports.validInputBlogIdToGetBlogDetail = (req, res, next) => {
    const { blog_id } = req.body;
    console.log(req.body)

    if(!blog_id || isEmpty(blog_id)) {
        return response({ res, data: getError(1503) });
    }

    const now = Date.now();
    req.query.query = {};
    req.query.query.status = statusModel.ENABLED;
    req.query.query.status_approved = statusBlog.APPROVED;
    req.query.query.date_released = { $lte: now };
    next();
}