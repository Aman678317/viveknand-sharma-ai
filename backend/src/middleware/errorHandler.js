const env = require('../config/env');

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    details: err.details,
    stack: env.isProduction ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
