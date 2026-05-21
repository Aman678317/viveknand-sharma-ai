const mongoose = require('mongoose');

const ActiveDeviceSchema = new mongoose.Schema({
  deviceId: String,
  ip: String,
  userAgent: String,
  lastSeenAt: Date
}, { _id: false });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  profileImage: { type: String },
  country: { type: String },
  preferredLanguage: { type: String, enum: ['en', 'hi', 'zh', 'ar', 'es', 'fr'], default: 'en' },
  bio: { type: String, default: '' },
  online: { type: Boolean, default: false },
  lastSeenAt: { type: Date },
  activeDevices: [ActiveDeviceSchema],
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  refreshTokens: [{
    tokenId: String,
    tokenHash: String,
    userAgent: String,
    ip: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

UserSchema.index({ fullName: 'text', username: 'text', email: 'text' });

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
