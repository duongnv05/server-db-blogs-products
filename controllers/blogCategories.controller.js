const RootController = require('./root.controller');

const BlogCatModel = require('../models/blogCategories');

const {
    validateInputBeforeCreateCatBlog,
    validateInputBeforeUpdateCatBlog,
    validInputBeforeSearchCatBlog,
    validInputIdsGetCatBlog
} = require('../middlewares/validInputCatBlog');
const {
    validateInputAppId
} = require('../middlewares')

const response = require('../utils/response');
const getError = require('../constants/ErrorMessages');
const { statusModel } = require('../constants/Global');
const { loggerError } = require('../services/logger');

function blogCategoriesController() {
    this._super.call(this);

    this.router.post('/api/admin/blog-category/create-new', validateInputBeforeCreateCatBlog, this.handleAdminCreateNew.bind(this));
    this.router.post('/api/admin/blog-category/update-info', validateInputBeforeUpdateCatBlog, this.handleAdminUpdateInfo.bind(this));
    this.router.post('/api/admin/blog-category/search-name', validateInputAppId, validInputBeforeSearchCatBlog, this.handleAdminSearchFollowingName.bind(this));
    this.router.post('/api/admin/blog-category/get-blog-categories', validateInputAppId, validInputIdsGetCatBlog, this.handleAdminGetBlogCategoryWithIds.bind(this));
    
    this.router.get('/api/admin/blog-category/get-for-management', validateInputAppId, this.handleAdminGetblogCategories.bind(this));

    //- client
    this.router.get('/api/blog-category/get-blog-categories', validateInputAppId, this.handleGetBlogCategories.bind(this));
    this.router.get('/api/blog-category/get-blog-category-detail', this.handleGetBlogCategoriesDetailWithUrl.bind(this));
}

blogCategoriesController.prototype = Object.create(RootController.prototype);

const tempPrototype = {
    _super: RootController,
    constructor: blogCategoriesController,

    handleAdminCreateNew: async function(req, res) {
        try {
            const { body } = req;

            const result = await BlogCatModel.createNew(body);
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleAdminUpdateInfo: async function(req, res) {
        try {
            const { body } = req;

            const result = await BlogCatModel.updateItemById(body._id, body);
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleAdminGetblogCategories: async function(req, res) {
        try {
            const { sign, skip, limit } = req.query;
            const result = await BlogCatModel.getblogCategoriesWithAppId(sign, skip, limit);
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error })
        }
    },

    handleAdminSearchFollowingName: async function(req, res) {
        try {
            const { sign } = req.query;
            const { name } = req.body;
            const data = await BlogCatModel.filterblogCategoriesByName({ status: "" }, sign, name);

            response({ res, data: { results: data } });
        } catch(error) {
            response({ res, data: error })
        }
    },

    handleAdminGetBlogCategoryWithIds: async function(req, res) {
        try {
            const { sign } = req.query;
            const { list_id } = req.body;

            const data = await BlogCatModel.getCategoriesWithIds({}, sign, list_id);

            response({ res, data: { blogCategories: data } })

        } catch(error) {
            response({ res, data: error })
        }
    },

    //- client
    handleGetBlogCategories: async function(req, res) {
        try {
            const { sign } = req.query;

            const result = await BlogCatModel.getblogCategoriesEnabledWithAppId(sign);

            if(result) {
                return  response({ res, data: result });
            }

            throw "handleGetBlogCategories error";
        } catch(error) {
            loggerError("handleGetBlogCategories: ", error);
            response({ res, data: getError(1) });
        }
    },

    handleGetBlogCategoriesDetailWithUrl: async function(req, res) {
        try {
            const { sign, url } = req.query;
            
            const result = await BlogCatModel.getBlogCategoryDetail(sign, {
                status: statusModel.ENABLED,
                url
            });

            if(result) {
                return  response({ res, data: result });
            }

            throw "handleGetBlogCategoriesDetailWithUrl"
        } catch(error) {
            loggerError("handleGetblogCategories: ", error);
            response({ res, data: getError(1) });
        }
    }
}//- end of prototype

Object.assign(blogCategoriesController.prototype, tempPrototype);

blogCategoriesController.instance = function() {
    return new blogCategoriesController();
}

module.exports = blogCategoriesController.instance();