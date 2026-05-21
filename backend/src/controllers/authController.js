const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const { signAccessToken, createRefreshToken, hashToken, verifyRefreshToken } = require('../utils/tokens');
const env = require('../config/env');

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    domain: env.cookieDomain,
    path: '/api/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
}

function issueSession(res, user, req) {
  const accessToken = signAccessToken(user);
  const refresh = createRefreshToken(user);
  user.refreshTokens.push({
    tokenId: refresh.tokenId,
    tokenHash: hashToken(refresh.token),
    userAgent: req.get('user-agent'),
    ip: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  res.cookie('refreshToken', refresh.token, cookieOptions());
  return accessToken;
}

const signup = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, country, preferredLanguage } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
  if (exists) throw new ApiError(409, 'Email or username already exists');
  const user = new User({
    fullName,
    username,
    email,
    password: await bcrypt.hash(password, 12),
    country,
    preferredLanguage: preferredLanguage || 'en'
  });
  const accessToken = issueSession(res, user, req);
  await user.save();
  res.status(201).json({ success: true, accessToken, user: user.toSafeJSON() });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password +refreshTokens');
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) throw new ApiError(401, 'Invalid credentials');
  const accessToken = issueSession(res, user, req);
  await user.save();
  res.json({ success: true, accessToken, user: user.toSafeJSON() });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');
  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.sub).select('+refreshTokens');
  if (!user) throw new ApiError(401, 'Invalid refresh token');
  const tokenHash = hashToken(token);
  const existing = user.refreshTokens.find((item) => item.tokenId === payload.jti && item.tokenHash === tokenHash);
  if (!existing) {
    user.refreshTokens = [];
    await user.save();
    throw new ApiError(401, 'Refresh token reuse detected');
  }
  user.refreshTokens = user.refreshTokens.filter((item) => item.tokenId !== payload.jti);
  const accessToken = issueSession(res, user, req);
  await user.save();
  res.json({ success: true, accessToken, user: user.toSafeJSON() });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { $pull: { refreshTokens: { tokenId: payload.jti } } });
    } catch (err) {
      // Idempotent logout.
    }
  }
  res.clearCookie('refreshToken', cookieOptions());
  res.json({ success: true });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { signup, login, refresh, logout, me };
