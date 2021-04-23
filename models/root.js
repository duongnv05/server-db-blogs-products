const mongoose = require('mongoose');
const { isNumber } = require('lodash');

const getErrorFromCode = require('../constants/ErrorMessages');
const { loggerError } = require('../services/logger');

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
		return this.module;
	},

	find: async function(query={}, skip, limit, projection={}, sort={}, disabledPlainObject=false) {	
		try {
			let _skip, _limit;
			if(typeof limit !== "undefined" && isNumber(limit)) {
				_limit = Math.abs(limit);
			}

			if(typeof skip !== "undefined" && isNumber(skip)) {
				_skip = skip > 0 ? skip * _limit : 0;
			}
			
			let result = {};
			if(disabledPlainObject) {
				result =  await this.model.find(query, projection).sort(sort).skip(_skip).limit(_limit)
			} else {
				result =  await this.model.find(query, projection).lean().sort(sort).skip(_skip).limit(_limit)
			}
	
			return Promise.resolve(result);
		} catch(err) {
			loggerError(err);
			return Promise.reject(getErrorFromCode(1));
		}
	},
	findOne: async function(query={}, projection={}, disabledPlainObject=false) {
		try {
			let result;
			if(disabledPlainObject) {
				result = await this.model.findOne(query, projection);
			} else {
				result = await this.model.findOne(query, projection).lean();
			}

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