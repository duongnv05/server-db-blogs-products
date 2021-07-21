const RootController = require('./root.controller');

const CatBlogModel = require('../models/categoriesBlog');

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

function CategoriesBlogController() {
    this._super.call(this);

    this.router.post('/api/admin/category-blog/create-new', validateInputBeforeCreateCatBlog, this.handleAdminCreateNew.bind(this));
    this.router.post('/api/admin/category-blog/update-info', validateInputBeforeUpdateCatBlog, this.handleAdminUpdateInfo.bind(this));
    this.router.post('/api/admin/category-blog/search-name', validateInputAppId, validInputBeforeSearchCatBlog, this.handleAdminSearchFollowingName.bind(this));
    this.router.post('/api/admin/category-blog/get-categories-blog', validateInputAppId, validInputIdsGetCatBlog, this.handleAdminGetCategoryBlogWithIds.bind(this));
    
    this.router.get('/api/admin/category-blog/get-for-management', validateInputAppId, this.handleAdminGetCategoriesBlog.bind(this));

    //- client
    this.router.get('/api/category-blog/get-categories-blog', validateInputAppId, this.handleGetCategoriesBlog.bind(this));
    this.router.get('/api/category-blog/get-category-blog-detail', this.handleGetCategoriesBlogDetailWithUrl.bind(this));
}

CategoriesBlogController.prototype = Object.create(RootController.prototype);

const tempPrototype = {
    _super: RootController,
    constructor: CategoriesBlogController,

    handleAdminCreateNew: async function(req, res) {
        try {
            const { body } = req;

            const result = await CatBlogModel.createNew(body);
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

            const result = await CatBlogModel.updateItemById(body._id, body);
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleAdminGetCategoriesBlog: async function(req, res) {
        try {
            const { sign, skip, limit } = req.query;
            const result = await CatBlogModel.getCategoriesBlogWithAppId(sign, skip, limit);
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
            const data = await CatBlogModel.filterCategoriesBlogByName({ status: "" }, sign, name);

            response({ res, data: { results: data } });
        } catch(error) {
            response({ res, data: error })
        }
    },

    handleAdminGetCategoryBlogWithIds: async function(req, res) {
        try {
            const { sign } = req.query;
            const { list_id } = req.body;

            const data = await CatBlogModel.getCategoriesWithIds({}, sign, list_id);

            response({ res, data: { categoriesBlog: data } })

        } catch(error) {
            response({ res, data: error })
        }
    },

    //- client
    handleGetCategoriesBlog: async function(req, res) {
        try {
            const { sign } = req.query;

            const result = await CatBlogModel.getCategoriesBlogEnabledWithAppId(sign);

            if(result) {
                return  response({ res, data: result });
            }

            throw "handleGetCategoriesBlog error";
        } catch(error) {
            loggerError("handleGetCategoriesBlog: ", error);
            response({ res, data: getError(1) });
        }
    },

    handleGetCategoriesBlogDetailWithUrl: async function(req, res) {
        try {
            const { sign, url } = req.query;
            
            const result = await CatBlogModel.getCategoryBlogDetail(sign, {
                status: statusModel.ENABLED,
                url
            });

            if(result) {
                return  response({ res, data: result });
            }

            throw "handleGetCategoriesBlogDetailWithUrl"
        } catch(error) {
            loggerError("handleGetCategoriesBlog: ", error);
            response({ res, data: getError(1) });
        }
    }
}//- end of prototype

Object.assign(CategoriesBlogController.prototype, tempPrototype);

CategoriesBlogController.instance = function() {
    return new CategoriesBlogController();
}

module.exports = CategoriesBlogController.instance();