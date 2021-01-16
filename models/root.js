const mongoose = require('mongoose');

const getErrorFromCode = require('../constants/ErrorMessages');

function RootModel() {
	this.model = null;
	this.schema = null;
	this.nameModel = null;
}

RootModel.prototype = {
	constructor: function() {},
	setModel: function(name, schema) {
		this.model = mongoose.model(name, schema);
	},
	getModel: function() {
		return this.model;
	},

	find: async function(query={}, skip, limit, projection={}) {
		try {
			const result =  await this.model.find(query, projection, { skip, limit });
			return Promise.resolve(result);
		} catch(err) {
			console.log(err);
			return Promise.reject(getErrorFromCode(1));
		}
	},
	findOne: async function(query={}, projection={}) {
		try {
			const result = await this.model.findOne(query, projection);
			return Promise.resolve(result);
		} catch(err) {
			console.log(err);
			return Promise.reject(getErrorFromCode(1));
		}
	},
	updateOne: async function(query={}, doc={}, options={}) {
		try {
			doc.date_modified = new Date().getTime();

			const result = await this.model.updateOne(query, doc, options);
			return Promise.resolve(result);
		} catch(err) {
			console.log(err);
			return Promise.reject(getErrorFromCode(1));
		}
	},
	insert: async function(data) {
		try {
			data.date_created = new Date().getTime();
			const result = await this.model.create(data);
			if(result && result._doc) {
				return Promise.resolve(result._doc);
			} else {
				return Promise.reject(err);
			}
		} catch(err) {
			console.log(err);
			return Promise.reject(getErrorFromCode(1));
		}
	},
	deleteOne: async function(query) {
		try {
			if(typeof query !== "undefined") {

			} else {
				return {
					err: 1,
					message: ERR_SYSTEM
				}
			}
		} catch(err) {
			console.log(err);
			return Promise.reject(getErrorFromCode(1));
		}
	}
}

module.exports = RootModel;