const asyncHandler = require('../utils/asyncHandler');
const { searchUsers } = require('../services/chatService');
const User = require('../models/User');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['fullName', 'profileImage', 'country', 'preferredLanguage', 'bio'];
  const update = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  });
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password -refreshTokens');
  res.json({ success: true, user });
});

const search = asyncHandler(async (req, res) => {
  res.json({ success: true, users: await searchUsers(req.user._id, req.query.q || '') });
});

const status = asyncHandler(async (req, res) => {
  const ids = String(req.query.ids || '').split(',').filter(Boolean);
  const users = await User.find({ _id: { $in: ids } }).select('online lastSeenAt username');
  res.json({ success: true, users });
});

module.exports = { getProfile, updateProfile, search, status };
