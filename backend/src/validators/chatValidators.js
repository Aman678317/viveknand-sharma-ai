const { body, param, query } = require('express-validator');

const createChatRules = [body('participantId').isMongoId()];
const sendMessageRules = [
  body('chatId').isMongoId(),
  body('content').trim().isLength({ min: 1, max: 4000 }),
  body('targetLanguage').optional().isIn(['en', 'hi', 'zh', 'ar', 'es', 'fr'])
];
const messagesRules = [
  param('chatId').isMongoId(),
  query('cursor').optional().isISO8601(),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

module.exports = { createChatRules, sendMessageRules, messagesRules };
