const express = require('express');
const createError = require('http-errors');
const path = require('path');

const favicon = require('serve-favicon');
const controllers = require('./controllers');

const {
	secretSession
} = require('./config');

const { connectDb } = require('./db');

const { loggerNotify } = require('./services/logger');

const app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
const port = 3002;

const cookieParser = require('cookie-parser');
app.use(cookieParser(secretSession));

const cors = require('cors');
app.use(cors({
	origin: "http//duongnv.me:3100"
}));

const bodyParser = require('body-parser');

const loggers = require('morgan');
app.use(loggers('dev'));

connectDb(() => {

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(controllers);

	app.use((req, res, next) => {
		next(createError(createError));
	});

	app.listen(port, () => {
		loggerNotify(`Server running on port ${port}`);
	})
});