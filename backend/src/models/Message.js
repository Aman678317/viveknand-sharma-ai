const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalContent: { type: String, required: true },
  sourceLanguage: { type: String, default: 'auto' },
  targetLanguage: { type: String, default: 'en' },
  translatedContent: { type: String },
  translations: [{
    language: String,
    content: String,
    provider: String,
    cached: Boolean,
    createdAt: { type: Date, default: Date.now }
  }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['queued', 'sent', 'delivered', 'read', 'failed'], default: 'sent' },
  metadata: { type: Object }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.virtual('content').get(function getContent() {
  return this.originalContent;
});

module.exports = mongoose.model('Message', MessageSchema);
