const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const formatted = result.error.flatten();
    throw new ApiError(400, 'Validation failed', formatted);
  }

  req.validated = result.data;
  return next();
};

module.exports = validate;
