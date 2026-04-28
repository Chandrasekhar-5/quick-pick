const logger = require("../config/logger");

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' || err.code === 'ERR_HTTP_HEADERS_SENT') {
        statusCode = 400;
        message = 'Invalid ID format. Please provide a valid ID.';
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found. Invalid ID format.';
    }

    logger.error({
    message: message,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    requestId: req.id,
    user: req.user ? req.user._id : "guest",
    stack: err.stack
});

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };