const Mongoose = require('mongoose');
// const uuid = require('uuid');
const shortid = require('shortid');
const async = require('async');
const { isEmpty } = require('lodash');

const RootModel = require('./root');

const getErrorFromCode = require('../constants/ErrorMessages');
const { statusBlog } = require('../constants/Blog');
const { statusModel } = require('../constants/Global');

const { loggerError } = require('../services/logger');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const blogSchema = new Mongoose.Schema({
	_id: { type: String, default: shortid.generate},
    title: { type: String, required: true },
    thumbnail: { type: String },
    short_description: { type: String, required: true },
    content: { type: String, required: true },
    time_read: { type: Number, required: true },
	date_released: { type: Number, required: true },
	actors: { type: Array, required: true }, //- username 
	tags: { type: Array, required: true },
	categories_blog_id: { type: Array },
	app_id: { type: String, required: true },
	counter_viewed: {type: Number, default: 0},

	status_approved: { type: String, default: 'pending', enum: statusBlog },
	status: { type: String, default: 'disabled', enum: statusModel },
	
	date_created: { type: Number, default: Date.now() },
	date_modified: Number
});	

blogSchema.index({_id: 1, app_id: 1}, {unique: true});

function BlogsModel() {
	this._super.call(this);
	this.nameModel = "blogs";
	this.setModel('blogs', blogSchema);
}

BlogsModel.prototype = Object.create(RootModel.prototype);

const tempPrototype = {
	_super: RootModel,
	constructor: BlogsModel,

	createNewBlog: function(_data) {
		return new Promise((resolve, reject) => {
			this.insert(_data)
			.then(result => {
				const _return = {};
				_return.blogInfo = result;

				resolve(_return);
			})
			.catch(error => {
				reject(getErrorFromCode(error));
			})
		})
	},	

	updateBlog: function(_id, app_id, _data) {		
		return new Promise((resolve, reject) => {
			this.model.updateOne({ _id, app_id }, _data)
				.then(result => {
					if(result && result.ok === 1) {
						resolve({ message: "Update blog success" });
						return
					}

					throw getErrorFromCode(1);
				})
				.catch(error => {
					loggerError("error update blog: " + error);
					reject(error);
				});
		});
	},

	getBlogsWithAppId: function(app_id, skip=0, limit=5, query={}) {
		const projection = {
			_id: 1,
			title: 1,
			short_description: 1,
			time_read: 1,
			date_released: 1,
			date_created: 1,
			actors: 1,
			tags: 1,
			status: 1,
			status_approved: 1,
			app_id: 1,
			image_url: 1,
			categories_blog_id: 1
		}

		const _query = Object.assign({ app_id }, query);

		return new Promise((resolve, reject) => {
			async.parallel({
				totalBlog: (cb) => {
					this.getTotalBlogWithAppId(app_id, _query)
						.then(total => {
							cb(null, total);
						}).catch(error => {
							cb(error, "");
						});
				},
				blogs: (cb) => {
					this.find(_query, skip, limit, projection, { date_created: 1 })
						.then(result => {
							if(result) {

								return cb(null, result)
							}

							throw "Cannot find blogs"
						}).catch(error => {
							loggerError(error);
							cb(getErrorFromCode(1), "");
						})
				}
			}, (error, result) => {
				if(!error) {
					const data = {
						totalBlog: result.totalBlog,
						blogs: result.blogs
					}

					resolve(data);
				} else {
					reject(error)
				}
			})
		})
	},

	getBlogDetailWithId: function(app_id, _id, query={}) {
		const projection = {
			_id: 1,
			title: 1,
			short_description: 1,
			time_read: 1,
			date_released: 1,
			date_created: 1,
			actors: 1,
			tags: 1,
			status: 1,
			status_approved: 1,
			content: 1,
			time_read: 1,
			app_id: 1,
			image_url: 1,
			categories_blog_id: 1,
			thumbnail: 1
		};

		const _query = {
			app_id, _id
		}

		Object.assign(_query, query);
		return new Promise((resolve, reject) => {
			this.findOne(_query, projection)
				.then(result => {
					if(result && !isEmpty(result)) {
						return resolve({ blogDetail: result })
					}
					throw getErrorFromCode(1007);
				}).catch(error => {
					loggerError(error);
					reject(error);
				})
		})
	},

	getTotalBlogWithAppId: function(app_id, query={}) {
		const _query = Object.assign({ app_id }, query);
		return new Promise((resolve, reject) => {
			if(app_id) {
				this.model.aggregate([
					{
						$match: _query
					}, 
					{
						$count: "totalBlog"
					}
				]).then(res => {
					const result = res[0];
	
					if(result) {
						resolve(result.totalBlog);
					} else {
						resolve(0)
					}
				}).catch(error => {
					loggerError(error);
					reject(getErrorFromCode(1));
				})
			}
		})
	},

	// getAllBlogsWithAppId: function(app_id,)
}

Object.assign(BlogsModel.prototype, tempPrototype);

BlogsModel.instance = function() {
	return new BlogsModel();
}
module.exports = BlogsModel.instance();