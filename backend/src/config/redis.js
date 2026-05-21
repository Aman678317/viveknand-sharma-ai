const { createClient } = require('redis');
const env = require('./env');

let client;

async function connectRedis() {
  if (client?.isOpen) return client;
  client = createClient({ url: env.redisUrl });
  client.on('error', (err) => console.error('Redis error:', err.message));
  await client.connect();
  return client;
}

function getRedis() {
  return client;
}

module.exports = { connectRedis, getRedis };
