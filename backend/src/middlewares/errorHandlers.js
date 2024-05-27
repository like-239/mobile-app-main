// errorHandlers.js

function handle401Error(req, res, next) {
    const error = new Error('Not Found');
    error.status = 401;
    next(error);
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    if (err.status === 401) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const method = req.method;
        const url = req.originalUrl;
        console.log(`Unauthorized access detected from ${ip} - ${method} ${url}`);
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}

module.exports = {
    handle401Error,
    errorHandler,
};
