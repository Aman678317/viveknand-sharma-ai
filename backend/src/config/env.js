require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const env = {
  nodeEnv,
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || (isProduction ? undefined : 'mongodb://127.0.0.1:27017/globaltalk'),
  redisUrl: process.env.REDIS_URL || (isProduction ? undefined : 'redis://127.0.0.1:6379'),
  redisRequired: process.env.REDIS_REQUIRED === 'true',
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

env.isProduction = isProduction;

if (env.isProduction) {
  const missing = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
}

module.exports = env;
