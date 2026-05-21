const User = require('../models/User');
const { verifyAccessToken } = require('../utils/tokens');

async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('Authentication error'));
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('fullName username preferredLanguage profileImage');
    if (!user) return next(new Error('Authentication error'));
    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
}

module.exports = socketAuth;
