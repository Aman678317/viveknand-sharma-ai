const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  nativeName: String,
  enabled: { type: Boolean, default: true },
  supportsTextTranslation: { type: Boolean, default: true },
  supportsVoiceTranslation: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Language', LanguageSchema);
