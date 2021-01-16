const Mongoose = require('mongoose');
// const uuid = require('uuid');
const shortid = require('shortid');
// const async = require('async');

const RootModel = require('./root');

const { loggerHotError } = require('../services/logger');

const {
	convertParamsToSnakeStyle,
	convertParamsToCamelStyle
} = require('../utils/convertParams');

const getErrorFromCode = require('../constants/ErrorMessages');
const { statusBlog } = require('../constants/Blog');


shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const blogSchema = new Mongoose.Schema({
	_id: { type: String, default: shortid.generate()},
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    content: { type: String, required: true },
	date_released: { type: Number, required: true },
	actors: { type: String, required: true }, //- username 
	tags: { type: Array, required: true },
	app_id: { type: String, unique: true, required: true },

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
		const data = convertParamsToSnakeStyle(_data);

		return new Promise((resolve, reject) => {
			this.insert(data)
			.then(result => {
				const _return = {};
				_return.blogInfo = convertParamsToCamelStyle(result);

				resolve(_return);
			})
			.catch(error => {
				reject(getErrorFromCode(error));
			})
		})
	},	

	updateBlog: function(_id, _data) {
		const data = convertDataToSnakeStyle(_data);
		
		return new Promise((resolve, reject) => {
			this.model.updateOne({ _id }, data)
				.then(result => {
					loggerHotError("updateBlog: " + result);
					resolve(result);
				})
				.catch(error => {
					loggerHotError("error update blog: " + error);
					reject(error);
				});
		});
	}
}

Object.assign(BlogsModel.prototype, tempPrototype);

BlogsModel.instance = function() {
	return new BlogsModel();
}
module.exports = BlogsModel.instance();