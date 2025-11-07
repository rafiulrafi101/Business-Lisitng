const notFound = (req, res) =>
  res.status(404).json({
    success: false,
    data: null,
    error: { message: 'Route not found' },
  });

module.exports = notFound;
