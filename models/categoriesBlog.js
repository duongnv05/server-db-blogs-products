const Mongoose = require('mongoose');
const async = require('async');
const { isEmpty } = require('lodash');
const shortid = require('shortid');

const RootModel = require('./root');

const getError = require('../constants/ErrorMessages');
const { loggerError } = require('../services/logger');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const categoriesBlogSchema = new Mongoose.Schema({
    _id: { type: String, default: shortid.generate},
    name: { type: String, unique: true, required: true },
    url: { type: String, unique: true, required: true },
	app_id: { type: String, required: true },

	date_created: Number,
	date_modified: Number
});

categoriesBlogSchema.index({_id: 1, app_id: 1, url: 1, name: 1}, {unique: true});

function categoriesBlogModel() {
    this._super.call(this);
	this.nameModel = "categoriesBlog";
	this.setModel("categoriesBlog", categoriesBlogSchema);
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
				console.log("abcd total")
				reject(getError(2));
			}
		});
	},

	getCategoriesBlogWithAppId: function(app_id, skip=0, limit=5) {
		const projection = {
			_id: 1,
			name: 1,
			url: 1,
			app_id: 1
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
						categorisBlog: result.categoriesBlog,
						total: result.total
					}

					resolve(data);
				} else {
					reject(error)
				}
			})
		});
	}
}

Object.assign(categoriesBlogModel.prototype, tempPrototype);

categoriesBlogModel.instance = function() {
	return new categoriesBlogModel();
}
module.exports = categoriesBlogModel.instance();