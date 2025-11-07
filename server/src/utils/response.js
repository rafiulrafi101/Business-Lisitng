const sendSuccess = (res, data = null, status = 200) =>
  res.status(status).json({ success: true, data, error: null });

module.exports = { sendSuccess };
