require('dotenv').config();

function readEnv(key, fallback) {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).trim();
}

const nodeEnv = readEnv('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';

const env = {
  nodeEnv,
  port: Number(readEnv('PORT', 4000)),
  mongoUri: readEnv('MONGO_URI', isProduction ? undefined : 'mongodb://127.0.0.1:27017/globaltalk'),
  redisUrl: readEnv('REDIS_URL', isProduction ? undefined : 'redis://127.0.0.1:6379'),
  redisRequired: readEnv('REDIS_REQUIRED') === 'true',
  jwtSecret: readEnv('JWT_SECRET', 'dev-access-secret-change-me'),
  jwtRefreshSecret: readEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
  accessTokenTtl: readEnv('ACCESS_TOKEN_TTL', '15m'),
  refreshTokenTtl: readEnv('REFRESH_TOKEN_TTL', '30d'),
  clientOrigin: readEnv('CLIENT_ORIGIN', 'http://localhost:5173'),
  cookieDomain: readEnv('COOKIE_DOMAIN'),
  geminiApiKey: readEnv('GEMINI_API_KEY'),
  deepseekApiKey: readEnv('DEEPSEEK_API_KEY'),
  openaiApiKey: readEnv('OPENAI_API_KEY'),
  stunServers: readEnv('STUN_SERVERS', 'stun:stun.l.google.com:19302').split(',').map((url) => ({ urls: url.trim() })),
  turnUrl: readEnv('TURN_URL'),
  turnUsername: readEnv('TURN_USERNAME'),
  turnCredential: readEnv('TURN_CREDENTIAL')
};

env.isProduction = isProduction;

if (env.isProduction) {
  const missing = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'].filter((key) => !readEnv(key));
  if (missing.length) {
    throw new Error(`Render env missing required variables: ${missing.join(', ')}. Add them in Render > Service > Environment.`);
  }
}

module.exports = env;
