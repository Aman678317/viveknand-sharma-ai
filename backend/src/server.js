const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { applySecurity } = require('./middleware/security');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const callRoutes = require('./routes/calls');
const translationRoutes = require('./routes/translation');
const setupSockets = require('./sockets');

const app = express();
const server = http.createServer(app);

applySecurity(app);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.locals.iceServers = [
  ...env.stunServers,
  ...(env.turnUrl ? [{ urls: env.turnUrl, username: env.turnUsername, credential: env.turnCredential }] : [])
];

app.get('/api/health', (req, res) => res.json({
  ok: true,
  service: 'globaltalk-api',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/translate', translationRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  console.log(`Starting GLOBALTALK AI API in ${env.nodeEnv} mode on port ${env.port}`);
  await connectDatabase();
  const redisClient = await connectRedis();
  const io = new Server(server, {
    cors: { origin: env.nodeEnv === 'development' ? true : env.clientOrigin, credentials: true },
    pingTimeout: 30000,
    pingInterval: 20000
  });
  setupSockets(io, { redisClient });
  server.listen(env.port, () => console.log(`GLOBALTALK AI API listening on ${env.port}`));
}

start().catch((err) => {
  console.error('Startup error:', err.message);
  process.exit(1);
});
