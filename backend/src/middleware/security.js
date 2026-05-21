const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const env = require('../config/env');

function applySecurity(app) {
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    origin(origin, cb) {
      if (!origin || origin === env.clientOrigin || env.nodeEnv === 'development') return cb(null, true);
      return cb(new Error('CORS origin blocked'));
    },
    credentials: true
  }));
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 800, standardHeaders: true, legacyHeaders: false }));
}

module.exports = { applySecurity };
