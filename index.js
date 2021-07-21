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
const port = process.env.PORT || 3002;

const cookieParser = require('cookie-parser');
app.use(cookieParser(secretSession));

const cors = require('cors');
app.use(cors({
	origin: "http//duongnv.me:3100"
}));

const loggers = require('morgan');
app.use(loggers('dev'));

connectDb(() => {
	const bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	const authenRequest = require('./middlewares/authenRequest');
    app.use(authenRequest);
	
	app.use(controllers);

	app.use((req, res, next) => {
		next(createError(createError));
	});

	app.listen(port, () => {
		loggerNotify(`Server running on port ${port}`);
	})
});