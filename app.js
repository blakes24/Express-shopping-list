const express = require('express');
const ExpressError = require('./expressError');
const itemsRoutes = require('./itemsRoutes');

const app = express();

app.use(express.json());

app.use('/items', itemsRoutes);

// 404 handler
app.use(function(req, res, next) {
	return next(new ExpressError('Not Found', 404));
});

// generic error handler
app.use(function(err, req, res, next) {
	let status = err.status || 500;
	let message = err.message;

	return res.status(status).json({
		error : { message, status }
	});
});

module.exports = app;
