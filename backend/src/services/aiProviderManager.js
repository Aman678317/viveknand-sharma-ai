const axios = require('axios');
const env = require('../config/env');

function normalizeLanguage(language) {
  const map = { en: 'English', hi: 'Hindi', zh: 'Chinese', ar: 'Arabic', es: 'Spanish', fr: 'French' };
  return map[language] || language || 'English';
}

class AIProviderManager {
  constructor() {
    this.providers = [
      { name: 'gemini', enabled: Boolean(env.geminiApiKey), call: this.callGemini.bind(this) },
      { name: 'deepseek', enabled: Boolean(env.deepseekApiKey), call: this.callDeepSeek.bind(this) },
      { name: 'openai', enabled: Boolean(env.openaiApiKey), call: this.callOpenAI.bind(this) }
    ];
  }

  async translate({ text, targetLanguage, sourceLanguage = 'auto' }) {
    const errors = [];
    for (const provider of this.providers) {
      if (!provider.enabled) continue;
      try {
        const startedAt = Date.now();
        const result = await this.retry(() => provider.call({ text, targetLanguage, sourceLanguage }), 2);
        return {
          translatedText: result.translatedText,
          detectedSourceLanguage: result.detectedSourceLanguage || sourceLanguage,
          provider: provider.name,
          latencyMs: Date.now() - startedAt,
          tokenUsage: result.tokenUsage || { estimatedInputChars: text.length, estimatedOutputChars: result.translatedText.length }
        };
      } catch (err) {
        errors.push({ provider: provider.name, message: err.message });
      }
    }
    return {
      translatedText: text,
      detectedSourceLanguage: sourceLanguage,
      provider: 'passthrough',
      fallbackReason: errors
    };
  }

  async retry(fn, attempts) {
    let lastError;
    for (let index = 0; index < attempts; index += 1) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 250 * (index + 1)));
      }
    }
    throw lastError;
  }

  buildPrompt({ text, targetLanguage, sourceLanguage }) {
    return `Detect the source language (${sourceLanguage}) and translate this message into ${normalizeLanguage(targetLanguage)}. Return only JSON with keys translatedText and detectedSourceLanguage.\nMessage: ${text}`;
  }

  parseJSON(text, fallback) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return JSON.parse(match ? match[0] : text);
    } catch (err) {
      return fallback;
    }
  }

  async callGemini(payload) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`,
      { contents: [{ role: 'user', parts: [{ text: this.buildPrompt(payload) }] }] },
      { timeout: 12000 }
    );
    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || payload.text;
    return this.parseJSON(raw, { translatedText: raw, detectedSourceLanguage: payload.sourceLanguage });
  }

  async callDeepSeek(payload) {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: this.buildPrompt(payload) }],
        temperature: 0.1
      },
      { headers: { Authorization: `Bearer ${env.deepseekApiKey}` }, timeout: 12000 }
    );
    const raw = response.data?.choices?.[0]?.message?.content || payload.text;
    return this.parseJSON(raw, { translatedText: raw, detectedSourceLanguage: payload.sourceLanguage });
  }

  async callOpenAI(payload) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: this.buildPrompt(payload) }],
        temperature: 0.1
      },
      { headers: { Authorization: `Bearer ${env.openaiApiKey}` }, timeout: 12000 }
    );
    const raw = response.data?.choices?.[0]?.message?.content || payload.text;
    return this.parseJSON(raw, { translatedText: raw, detectedSourceLanguage: payload.sourceLanguage });
  }
}

module.exports = new AIProviderManager();
