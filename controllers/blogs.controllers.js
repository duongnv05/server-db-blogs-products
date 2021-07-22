const blogsModel = require('../models/blogs');

const RootController = require('./root.controller');

const { validateInputAppId } = require('../middlewares')
const {
    validInputBlog,
    validInputBlogToUpdate,
    validInputGetBlogsClient,
    validInputGetBlogWithBlogCatId,
    validInputBlogIdToGetBlogDetail
} = require('../middlewares/validInputInfoBlog');

const { loggerError } = require('../services/logger');

const response = require('../utils/response');

const getErrorFromCode = require("../constants/ErrorMessages");

function BlogsController() {
    this._super.call(this);

    //- router admin management
    this.router.post('/api/admin/blog/create-new', validInputBlog, this.handleCreateNewBlog.bind(this));
    this.router.post('/api/admin/blog/get-detail', validateInputAppId, this.handleGetBlogDetail.bind(this));
    this.router.post('/api/admin/blog/update-info', validInputBlogToUpdate, this.handleUpdateInfoBlog.bind(this));

    this.router.get('/api/admin/blog/get-blogs-management', validateInputAppId, this.handleGetBlogsForManage.bind(this));

    //- load blog follow id
    // client
    this.router.get('/api/blog/get-blogs', validInputGetBlogsClient, this.handleGetBlogs.bind(this));
    this.router.get('/api/blog/get-blogs-with-cat-blog', validInputGetBlogWithBlogCatId, this.handleGetBlogs.bind(this));

    this.router.post('/api/blog/get-detail', validInputBlogIdToGetBlogDetail, this.handleGetBlogDetailToClient.bind(this));
}

BlogsController.prototype = Object.create(RootController.prototype);
const tempPrototype = {
    _super: RootController,
    constructor: BlogsController,

    handleCreateNewBlog: async function(req, res) {
        try {
            const result = await blogsModel.createNewBlog(req.body);
            if(!result.error) {
                return response({ res, data: result })
            }

            throw result;
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleGetBlogsForManage: async function(req, res) {
        try {
            const result = await blogsModel.getBlogsWithAppId(req.query.sign);
            
            if(!result || !result.error) {
                return response({ res, data: result })
            }

            throw result;
        } catch(error) {
            loggerError(error)
            response({ res, data: error });
        }
    },

    handleGetBlogDetail: async function(req, res) {
        try {
            const { blog_id } = req.body;
            const { sign } = req.query;
            if(!blog_id) throw getErrorFromCode(5000);

            const result = await blogsModel.getBlogDetailWithId(sign, blog_id);

            if(!result.error) {
                return response({ res, data: result });
            }

            throw result;
        } catch(error) {
            loggerError(error);
            response({ res, data: error })
        }
    },

    handleUpdateInfoBlog: async function(req, res) {
        try {
            const { _id } = req.body;
            const { sign } = req.query;

            const result = await blogsModel.updateBlog(_id, sign, req.body);

            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw result;
        } catch(error) {
            response({ res, data: error })
        }
    },

    handleGetBlogs: async function(req, res) {
        try {
            const { sign, skip, limit, query } = req.query;
            console.log(query)
            const result = await blogsModel.getBlogsWithAppId(sign, skip, limit, query);;
            if(!result || !result.error) {
                return response({ res, data: result })
            }

            throw result;
        } catch(error) {
            response({ res, data: error })
        }
    },

    handleGetBlogDetailToClient: async function(req, res) {
        try {
            const { blog_id } = req.body;
            const { sign, query } = req.query;
            if(!blog_id) throw getErrorFromCode(5000);

            const result = await blogsModel.getBlogDetailWithId(sign, blog_id, query);

            if(!result.error) {
                return response({ res, data: result });
            }

            throw result;
        } catch(error) {
            loggerError(error);
            response({ res, data: error })
        }
    }
}

Object.assign(BlogsController.prototype, tempPrototype);

BlogsController.getInstance = function() {
    return new BlogsController();
}

module.exports = BlogsController.getInstance();
