const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const listingRoutes = require('./routes/listing.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const metaRoutes = require('./routes/meta.routes');

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv !== 'test') {
  app.use(
    morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
      skip: () => env.nodeEnv === 'test',
    }),
  );
}

app.get('/api/health', (req, res) =>
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meta', metaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
