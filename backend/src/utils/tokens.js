const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username, language: user.preferredLanguage },
    env.jwtSecret,
    { expiresIn: env.accessTokenTtl }
  );
}

function signRefreshToken(user, tokenId) {
  return jwt.sign({ sub: user._id.toString(), jti: tokenId }, env.jwtRefreshSecret, { expiresIn: env.refreshTokenTtl });
}

function createRefreshToken(user) {
  const tokenId = crypto.randomUUID();
  return { tokenId, token: signRefreshToken(user, tokenId) };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

module.exports = { signAccessToken, createRefreshToken, hashToken, verifyAccessToken, verifyRefreshToken };
