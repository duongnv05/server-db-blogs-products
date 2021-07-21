const Mongoose = require('mongoose');
const async = require('async');
const { isEmpty } = require('lodash');
const shortid = require('shortid');

const RootModel = require('./root');

const { statusModel } = require('../constants/Global');
const getError = require('../constants/ErrorMessages');
const { loggerError } = require('../services/logger');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const categoriesBlogSchema = new Mongoose.Schema({
    _id: { type: String, default: shortid.generate},
    name: { type: String, required: true },
    url: { type: String, required: true },
	app_id: { type: String, required: true },
	categories_blog_id: { type: Array, default: [] },

	status: { type: String, default: statusModel.ENABLED, enum: statusModel },

	date_created: Number,
	date_modified: Number
});

categoriesBlogSchema.index({_id: 1, app_id: 1, url: 1, name: 1}, {unique: true});

function categoriesBlogModel() {
    this._super.call(this);
	this.nameModel = "categories_blog";	
	this.setModel("categories_blog", categoriesBlogSchema);
}

categoriesBlogModel.prototype = Object.create(RootModel.prototype);

const tempPrototype = {
	_super: RootModel,
	constructor: categoriesBlogModel,

	createNew: function(doc) {
		const { name, url, app_id } = doc;
		return new Promise((resolve, reject) => {
			async.parallel({
				name: (cb) => {
					this.findOne({ name, app_id })
						.then(result => {
							if(result && !isEmpty(result)) {
								throw getError(1500);
							} else {
								cb(null, null); 
							}
						}).catch((error) => {
							console.log(error)
							cb(error);
						})
				},
				url: (cb) => {
					this.findOne({ url, app_id })
						.then(result => {
							if(result && !isEmpty(result)) {
								throw getError(1501);
							} else {
								cb(null, null);
							}
						}).catch((error) => {
							cb(error);
						})
				}
			}, (error) => {
				if(!error) {
					this.insert(doc)
						.then(result => {
							resolve({
								item: result
							})
						}).catch(error => 
							reject(getError(error))
						);
				} else {
					reject(error);
				}
			})
		})
	},

	updateItemById: function(id, update) {
		const { name, url } = update;

		return new Promise((resolve, reject) => {
			async.parallel({
				name: (cb) => {
					this.findOne({ name })
						.then(result => {
							if(result && !isEmpty(result)) {
								throw getError(1500);
							} else {
								cb(null, null); 
							}
						}).catch((error) => {
							cb(error);
						})
				},
				url: (cb) => {
					this.findOne({ url })
						.then(result => {
							if(result && !isEmpty(result)) {
								throw getError(1501);
							} else {
								cb(null, null);
							}
						}).catch((error) => {
							cb(error);
						})
				}
			}, (error, result) => {
				if(!error) {
					this.updateOne({
						id: _id
					}, update)
						.then(result => {
							if(result && result.ok) {
								resolve({ message: "Update successful" });
							}

							throw getError(1);
						}).catch(error => {
							reject(error);
						})
				} else {
					reject(error);
				}
			})
		})
	},

	getTotalWithAppId: function(app_id) {
		return new Promise((resolve, reject) => {
			if(app_id) {
				this.model.aggregate([
					{
						$match: {
							app_id
						},
					},
					{
						$count: 'total'
					}
				]).then(result => {
					const data = result[0];

					if(data) {
						resolve(data.total);
					} else {
						resolve(0);
					}
				}).catch(error => {
					reject(getError(1));
				})
			} else {
				reject(getError(2));
			}
		});
	},

	getCategoriesBlogWithAppId: function(app_id, skip=0, limit=5) {
		const projection = {
			_id: 1,
			name: 1,
			url: 1,
			app_id: 1,
			status: 1
		};

		return new Promise((resolve, reject) => {
			async.parallel({
				total: (cb) => {
					this.getTotalWithAppId(app_id)
						.then(total => {
							cb(null, total);
						}).catch(error => {
							cb(error, "");
						})
				},
				categoriesBlog: cb => {
					this.find({app_id}, skip, limit, projection, { date_created: -1 })
						.then(result => {
							if(result) {
								return cb(null, result);
							}

							throw "cannot find results";
						}).catch(error => {
							loggerError(error);
							cb(getError(1), '');
						})
				}
			}, (error, result) => {
				if(!error) {
					const data = {
						categoriesBlog: result.categoriesBlog,
						total: result.total
					}

					resolve(data);
				} else {
					reject(error)
				}
			})
		});
	},

	getCategoriesWithIds: function(query = {}, app_id, list_id) {
		return new  Promise((resolve, reject) => {
			const projection = {
				_id: 1,
				name: 1,
				url: 1,
				app_id: 1,
				status: 1
			};

			let _query = Object.assign({ app_id }, query);
			_query._id = { $in: list_id };
			console.log(_query )

			this.find(_query, projection)
				.then(result => {
					console.log(result)
					resolve(result);
				}).catch(error => {
					console.loggerError("getCategoriesWithIds: ", error);
					reject(getError(2));
				})
		});
	},

	filterCategoriesBlogByName(query, app_id, name) {
		return new Promise((resolve, reject) => {
			const projection = {
				_id: 1,
				name: 1,
				url: 1,
				app_id: 1,
			};
			let regex = `[${name}*]{${name.length},}`;
			regex = new RegExp(regex, "si");
			let _query = Object.assign({}, query);
			_query = { app_id }
			_query.name  = { $regex: regex  };

			this.find(_query, projection)
				.then(result => {

					resolve(result);
					
				}).catch(error => {
					console.loggerError("filterCategoriesBlogByName: ", error);
					reject(getError(2))
				})
		})
	},

	getCategoriesBlogEnabledWithAppId(app_id) {
		return new Promise((resolve, reject) => {
			const projection = {
				_id: 1,
				name: 1,
				url: 1,
			};
			this.find({
				app_id,
				status: statusModel.ENABLED
			}, null, null, projection)
				.then(result => {
					if(result) {
						return resolve({
							categoriesBlog: result
						});
					}

					throw "cannot get categories blog";
				}).catch(error => {
					loggerError("getCategoriesBlogEnabledWithAppId: ", error);
					reject(getError(1));
				})
		})
	},

	getCategoryBlogDetail: function(app_id, query) {
		return new Promise((resolve, reject) => {
			const projection = {
				name: 1,
				url: 1,
				app_id: 1,
				categories_blog_id: 1,
			}
			let _query = { app_id };
			Object.assign(_query, query);

			this.findOne(_query, projection)
				.then(result => {
					if(result) {
						console.log(result);
						return resolve({
							categoryBlog: result
						})
					}

					throw "cannot get category blog detail " + query;
				}).catch(error => {
					loggerError("getCategoryBlogDetail: ", error);
					reject(getError(1));
				})
		})
	}
}//- end of model

Object.assign(categoriesBlogModel.prototype, tempPrototype);

categoriesBlogModel.instance = function() {
	return new categoriesBlogModel();
}
module.exports = categoriesBlogModel.instance();