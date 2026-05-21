const { translateMessage } = require('./translationService');

async function translateWithFallback(payload) {
  return translateMessage(payload.text, payload.targetLanguage, payload.sourceLanguage);
}

module.exports = { translateWithFallback };
