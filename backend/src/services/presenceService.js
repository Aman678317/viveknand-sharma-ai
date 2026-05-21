const User = require('../models/User');
const OnlineSession = require('../models/OnlineSession');

async function markOnline(userId, socket, redis) {
  await User.findByIdAndUpdate(userId, { online: true, lastSeenAt: new Date() });
  await OnlineSession.findOneAndUpdate(
    { user: userId, socketId: socket.id },
    {
      user: userId,
      socketId: socket.id,
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'],
      connectedAt: new Date(),
      lastHeartbeatAt: new Date()
    },
    { upsert: true, new: true }
  );
  if (redis?.isOpen) await redis.sAdd(`presence:${userId}`, socket.id);
}

async function markOffline(userId, socketId, redis) {
  await OnlineSession.deleteOne({ user: userId, socketId });
  if (redis?.isOpen) await redis.sRem(`presence:${userId}`, socketId);
  const remaining = await OnlineSession.countDocuments({ user: userId });
  if (!remaining) await User.findByIdAndUpdate(userId, { online: false, lastSeenAt: new Date() });
  return remaining === 0;
}

module.exports = { markOnline, markOffline };
