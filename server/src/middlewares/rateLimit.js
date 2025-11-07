const rateLimit = require('express-rate-limit');

const buildLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        data: null,
        error: { message: 'Too many requests, please try again later.' },
      });
    },
    ...options,
  });

const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

const listingWriteLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

module.exports = {
  authLimiter,
  listingWriteLimiter,
};
