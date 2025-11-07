const { ZodError } = require('zod');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, _next) => {
  const error = err;
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let details = error.errors || undefined;

  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
  }

  if (error?.name === 'ValidationError' && error?.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map((item) => ({
      path: item.path,
      message: item.message,
    }));
  }

  const response = {
    success: false,
    data: null,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  };

  if (env.nodeEnv === 'development') {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound('Route not found'));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
