const NodeCache = require('node-cache');

function Cache(ttlSeconds) {
	this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
}

Cache.prototype = {
	constructor: Cache,

	get: function(key, storeFn) {
		const value = this.cache.get(key);
	    if (value) {
			return Promise.resolve(value);
	    }

	    return storeFunction().then((result) => {
			this.cache.set(key, result);
			return result;
	    });
	},

	del: function(keys) {
		this.cache.del(keys);
	},

	delStartWith: function(startStr = '') {
		if(!startStr) {
			return;
		}

		const keys = this.cache.keys();
    	for (const key of keys) {
			if (key.indexOf(startStr) === 0) {
				this.del(key);
			}
		}
	},

	flush: function() {
		this.cache.flushAll();
	}
}

module.exports = Cache;