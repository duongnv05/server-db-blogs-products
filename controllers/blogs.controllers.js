const blogsModel = require('../models/blogs');

const RootController = require('./root.controller');

const { validInputBlog } = require('../middlewares/validInputInfoBlog');

const response = require('../utils/response');

const getErrorFromCode = require("../constants/ErrorMessages");

function BlogsController() {
    this._super.call(this);

    //- router
    this.router.post('/api/blog/create-new', validInputBlog, this.handleCreateNewBlog.bind(this));
}

BlogsController.prototype = Object.create(RootController.prototype);
const tempPrototype = {
    _super: RootController,
    constructor: BlogsController,

    handleCreateNewBlog: async function(req, res) {
        try {
            const result = await blogsModel.createNewBlog(req.body);
            if(result) {
                return response({ res, data: result })
            }
        } catch(error) {
            response({ res, data: getErrorFromCode(1) });
        }
    }
}

Object.assign(BlogsController.prototype, tempPrototype);

BlogsController.getInstance = function() {
    return new BlogsController();
}

module.exports = BlogsController.getInstance();
