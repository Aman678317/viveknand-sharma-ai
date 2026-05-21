const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['audio', 'video'], default: 'video' },
  status: { type: String, enum: ['ringing', 'missed', 'completed', 'rejected', 'ongoing', 'failed'], default: 'ringing' },
  startedAt: Date,
  acceptedAt: Date,
  endedAt: Date,
  durationSeconds: { type: Number, default: 0 },
  networkQuality: {
    jitter: Number,
    rtt: Number,
    packetsLost: Number,
    score: Number
  },
  metadata: Object
}, { timestamps: true });

CallSchema.index({ caller: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Call', CallSchema);
