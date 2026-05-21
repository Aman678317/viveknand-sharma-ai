const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['message', 'call', 'system'], required: true },
  title: String,
  body: String,
  data: Object,
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
