const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { authenticate } = require('./middlewares/auth');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth.routes');
const listingRoutes = require('./routes/listing.routes');
const userRoutes = require('./routes/user.routes');
const metaRoutes = require('./routes/meta.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

const allowedOrigins = env.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(cookieParser());
app.use(authenticate);

app.get('/api/health', (req, res) =>
  res.json({
    success: true,
    data: { status: 'ok' },
    error: null,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
