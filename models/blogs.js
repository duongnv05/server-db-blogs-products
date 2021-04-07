const Mongoose = require('mongoose');
// const uuid = require('uuid');
const shortid = require('shortid');
const async = require('async');
const { isEmpty } = require('lodash');

const RootModel = require('./root');

const { loggerHotError } = require('../services/logger');

const getErrorFromCode = require('../constants/ErrorMessages');
const { statusBlog } = require('../constants/Blog');

const { loggerError } = require('../services/logger');
const { resolve } = require('path');


shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const blogSchema = new Mongoose.Schema({
	_id: { type: String, default: shortid.generate()},
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    content: { type: String, required: true },
    time_read: { type: Number, required: true },
	date_released: { type: Number, required: true },
	actors: { type: Array, required: true }, //- username 
	tags: { type: Array, required: true },
	app_id: { type: String, required: true },

	status: { type: String, default: 'pending', enum: statusBlog },
	date_created: { type: Number, default: Date.now() },
	date_modified: Number
});	

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

	updateBlog: function(_id, _data) {		
		return new Promise((resolve, reject) => {
			this.model.updateOne({ _id }, _data)
				.then(result => {
					loggerHotError("updateBlog: " + result);
					resolve(result);
				})
				.catch(error => {
					loggerHotError("error update blog: " + error);
					reject(error);
				});
		});
	},

	getBlogsWithAppId: function(app_id, skip, limit=5) {
		const projection = {
			_id: 1,
			title: 1,
			short_description: 1,
			time_read: 1,
			date_released: 1,
			date_created: 1,
			actors: 1,
			tags: 1,
			status: 1
		}

		const self = this;
		return new Promise((resolve, reject) => {
			async.parallel({
				totalBlog: (cb) => {
					this.getTotalBlogWithAppId(app_id)
						.then(total => {
							cb(null, total);
						}).catch(error => {
							cb(error, "");
						});
				},
				blogs: (cb) => {
					self.find({ app_id }, skip, limit, projection)
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

	getBlogDetailWithId: function(_id) {
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
			content: 1,
			time_read: 1
		};
		return new Promise((resolve, reject) => {
			this.findOne({ _id }, projection)
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

	getTotalBlogWithAppId: function(appId) {
		return new Promise((resolve, reject) => {
			if(appId) {
				this.model.aggregate([
					{
						$match: {
							app_id: appId
						}
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
	
			return null;
		})
	}
}

Object.assign(BlogsModel.prototype, tempPrototype);

BlogsModel.instance = function() {
	return new BlogsModel();
}
module.exports = BlogsModel.instance();