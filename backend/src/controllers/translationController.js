const asyncHandler = require('../utils/asyncHandler');
const { translateMessage } = require('../services/translationService');

const translate = asyncHandler(async (req, res) => {
  const result = await translateMessage(req.body.text, req.body.targetLanguage, req.body.sourceLanguage || 'auto');
  res.json({ success: true, translation: result });
});

module.exports = { translate };
