const { getRedis } = require('../config/redis');

async function trackTranslation(metric) {
  const redis = getRedis();
  if (!redis?.isOpen) return;
  const day = new Date().toISOString().slice(0, 10);
  const key = `ai:usage:${day}`;
  await redis.hIncrBy(key, `provider:${metric.provider}:requests`, 1);
  await redis.hIncrBy(key, 'chars:input', metric.tokenUsage?.estimatedInputChars || 0);
  await redis.hIncrBy(key, 'chars:output', metric.tokenUsage?.estimatedOutputChars || 0);
  await redis.expire(key, 60 * 60 * 24 * 45);
}

module.exports = { trackTranslation };
