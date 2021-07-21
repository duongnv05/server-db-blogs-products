const Mongoose = require('mongoose');
const uuid = require('uuid');

const RootModel = require('./root');

const { statusModel } = require('../constants/Global');

const  tagsSchema = new Mongoose.Schema({
	_id: { default: uuid.v1 },
	title: { type: String, required: true },
	status: { enum: statusModel, default: statusModel.ENABLED },

	date_created: { type: Number, default: Date.now() },
	date_modified: Number
});

function TagsModel() {
	this._super.call(this);
	this.nameModel = 'tags';
	this.setModel('tags', tagsSchema);
}

TagsModel.prototype = Object.create(RootModel.prototype);

const _prototype = {
	_super: RootModel,
	constructor: TagsModel,

}

Object.assign(TagsModel.prototype, _prototype);

TagsModel.instance = function() {
	return new TagsModel();
}

module.exports = TagsModel.instance();