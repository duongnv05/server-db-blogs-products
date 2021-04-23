const RootController = require('./root.controller');

const CatBlogModel = require('../models/categoriesBlog');

const {
    validateInputBeforeCreateCatBlog,
    validateInputBeforeUpdateCatBlog
} = require('../middlewares/validInputCatBlog');
const {
    validateInputAppId
} = require('../middlewares')

const response = require('../utils/response');
const getError = require('../constants/ErrorMessages');

function CategoriesBlogController() {
    this._super.call(this);

    this.router.post('/api/admin/category-blog/create-new', validateInputBeforeCreateCatBlog, this.handleCreateNew.bind(this));
    this.router.post('/api/admin/category-blog/update-info', validateInputBeforeUpdateCatBlog, this.handleUpdateInfo.bind(this));
    
    this.router.get('/api/admin/category-blog/get-for-management', validateInputAppId, this.handleGetCategoriesBlog.bind(this));
}

CategoriesBlogController.prototype = Object.create(RootController.prototype);

const tempPrototype = {
    _super: RootController,
    constructor: CategoriesBlogController,

    handleCreateNew: async function(req, res) {
        try {
            const { body } = req;

            console.log("body: ", body)

            const result = await CatBlogModel.createNew(body);
            console.log("result", result)
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error });
        }
    },

    handleUpdateInfo: async function(req, res) {
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

    handleGetCategoriesBlog: async function(req, res) {
        try {
            const { app_id, skip, limit } = req.query;
            const result = await CatBlogModel.getCategoriesBlogWithAppId(app_id, skip, limit);
            if(result && !result.error) {
                return response({ res, data: result });
            }

            throw getError(1);
        } catch(error) {
            response({ res, data: error })
        }
    }
}

Object.assign(CategoriesBlogController.prototype, tempPrototype);

CategoriesBlogController.instance = function() {
    return new CategoriesBlogController();
}

module.exports = CategoriesBlogController.instance();