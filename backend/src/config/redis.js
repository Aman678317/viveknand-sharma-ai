const { createClient } = require('redis');
const env = require('./env');

let client;

async function connectRedis() {
  if (client?.isOpen) return client;
  if (!env.redisUrl) {
    console.warn('Redis disabled: REDIS_URL is not set. Cache and presence scaling will run in degraded mode.');
    return null;
  }
  client = createClient({ url: env.redisUrl });
  client.on('error', (err) => console.error('Redis error:', err.message));
  try {
    await client.connect();
    return client;
  } catch (err) {
    if (env.redisRequired) throw err;
    console.warn(`Redis unavailable: ${err.message}. Continuing in degraded mode.`);
    client = null;
    return null;
  }
}

function getRedis() {
  return client;
}

module.exports = { connectRedis, getRedis };
