const { getRedis } = require('../config/redis');

async function getAIMetrics() {
  const redis = getRedis();
  if (!redis?.isOpen) return { available: false };
  const day = new Date().toISOString().slice(0, 10);
  return { available: true, day, usage: await redis.hGetAll(`ai:usage:${day}`) };
}

module.exports = { getAIMetrics };
