const bcrypt = require('bcrypt');

function Bcrypt() {
	this.saltRound = 16;
}

Bcrypt.prototype = {
	constructor: Bcrypt,
	hashData: function(data, cb) {
		bcrypt.hash(data, this.saltRound, cb);
	},
	compareHashedWithData: function(data, encrypted, cb) {
		bcrypt.compare(data, encrypted, cb);
	}
}

Bcrypt.instance = function() {
	return new Bcrypt();
}

module.exports = Bcrypt.instance();