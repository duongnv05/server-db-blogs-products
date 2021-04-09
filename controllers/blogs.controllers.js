const blogsModel = require('../models/blogs');

const RootController = require('./root.controller');

const { validInputBlog } = require('../middlewares/validInputInfoBlog');

const { loggerError } = require('../services/logger');

const response = require('../utils/response');

const getErrorFromCode = require("../constants/ErrorMessages");

function BlogsController() {
    this._super.call(this);

    //- router admin management
    this.router.post('/api/admin/blog/create-new', validInputBlog, this.handleCreateNewBlog.bind(this));
    this.router.post('/api/admin/blog/get-detail', this.handleGetBlogDetail.bind(this));

    this.router.get('/api/admin/blog/get-blogs-management', this.handleGetBlogsForManage.bind(this));
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
            const result = await blogsModel.getBlogsWithAppId(req.query.app_id);
            if(result.error) {
                return response({ res, data: result })
            }

            throw result;
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleGetBlogDetail: async function(req, res) {
        try {
            const { blog_id } = req.body;
            if(!blog_id) throw getErrorFromCode(1008);

            const result = await blogsModel.getBlogDetailWithId(blog_id);

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
