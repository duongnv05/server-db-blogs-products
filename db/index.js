const mongoose = require('mongoose');
const { connectStringDb } = require('../config');
const { loggerNotify } = require('../services/logger')

const db = mongoose.connection;

exports.connectDb = (cb=() => {}) => {
	//- connect db
	mongoose.set('useCreateIndex', true);
	mongoose.connect(connectStringDb,  { 
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	db.on("connected", (err, res) => {
		loggerNotify('#database connected');
		cb();
	});
	db.on("error", err => {
		loggerNotify(`##error connect database: ${err}`);
	});
}

exports.db = db;