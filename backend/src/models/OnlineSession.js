const mongoose = require('mongoose');

const OnlineSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  socketId: { type: String, required: true, index: true },
  deviceId: String,
  ip: String,
  userAgent: String,
  connectedAt: { type: Date, default: Date.now },
  lastHeartbeatAt: { type: Date, default: Date.now }
}, { timestamps: true });

OnlineSessionSchema.index({ user: 1, socketId: 1 }, { unique: true });

module.exports = mongoose.model('OnlineSession', OnlineSessionSchema);
