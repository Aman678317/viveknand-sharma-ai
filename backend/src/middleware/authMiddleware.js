const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/tokens');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('-password -refreshTokens');
    if (!user) throw new ApiError(401, 'User no longer exists');
    req.auth = payload;
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired access token'));
  }
}

module.exports = authMiddleware;
