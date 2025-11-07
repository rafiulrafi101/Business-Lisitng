const env = require('../config/env');

const errorHandler = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    data: null,
    error: {
      message: err.message || 'Internal Server Error',
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  if (!env.isProduction && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
