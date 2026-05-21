const crypto = require('crypto');
const aiProviderManager = require('./aiProviderManager');
const aiUsageTracker = require('./aiUsageTracker');
const { getRedis } = require('../config/redis');

function cacheKey(text, targetLanguage, sourceLanguage) {
  const hash = crypto.createHash('sha256').update(`${sourceLanguage}:${targetLanguage}:${text}`).digest('hex');
  return `translation:${hash}`;
}

async function translateMessage(text, targetLanguage = 'en', sourceLanguage = 'auto') {
  const redis = getRedis();
  const key = cacheKey(text, targetLanguage, sourceLanguage);
  if (redis?.isOpen) {
    const cached = await redis.get(key);
    if (cached) return { ...JSON.parse(cached), cached: true };
  }

  const result = await aiProviderManager.translate({ text, targetLanguage, sourceLanguage });
  const normalized = {
    translated: result.translatedText,
    translatedText: result.translatedText,
    sourceLanguage: result.detectedSourceLanguage,
    targetLanguage,
    provider: result.provider,
    cached: false,
    tokenUsage: result.tokenUsage,
    latencyMs: result.latencyMs
  };

  await aiUsageTracker.trackTranslation(normalized);
  if (redis?.isOpen) await redis.set(key, JSON.stringify(normalized), { EX: 60 * 60 * 24 * 14 });
  return normalized;
}

module.exports = { translateMessage };
