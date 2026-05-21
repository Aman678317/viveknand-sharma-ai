const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  title: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastActivityAt: { type: Date, default: Date.now },
  readStates: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastReadMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    readAt: Date
  }]
}, { timestamps: true });

ChatSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model('Chat', ChatSchema);
