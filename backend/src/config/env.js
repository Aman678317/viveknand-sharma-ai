require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/globaltalk',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  jwtSecret: process.env.JWT_SECRET || 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '30d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  geminiApiKey: process.env.GEMINI_API_KEY,
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  stunServers: (process.env.STUN_SERVERS || 'stun:stun.l.google.com:19302').split(',').map((url) => ({ urls: url.trim() })),
  turnUrl: process.env.TURN_URL,
  turnUsername: process.env.TURN_USERNAME,
  turnCredential: process.env.TURN_CREDENTIAL
};

env.isProduction = env.nodeEnv === 'production';

module.exports = env;
