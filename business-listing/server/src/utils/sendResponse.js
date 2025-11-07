const sendResponse = (res, statusCode, data = null) =>
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 400,
    data,
    error: null,
  });

module.exports = sendResponse;
