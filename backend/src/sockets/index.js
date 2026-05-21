const socketAuth = require('./socketAuth');
const setupChatSockets = require('./chatSocketHandler');
const setupCallSockets = require('./callSocketHandler');
const { markOnline, markOffline } = require('../services/presenceService');

module.exports = function setupSockets(io, { redisClient } = {}) {
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const uid = socket.userId;
    socket.join(`user:${uid}`);
    await markOnline(uid, socket, redisClient);
    io.emit('user-online', { userId: uid, at: new Date() });

    setupChatSockets(io, socket, { redisClient });
    setupCallSockets(io, socket, { redisClient });

    socket.on('reconnect-user', async () => {
      await markOnline(uid, socket, redisClient);
      socket.emit('reconnect-user', { success: true });
    });

    socket.on('disconnect', async () => {
      const offline = await markOffline(uid, socket.id, redisClient);
      if (offline) io.emit('user-offline', { userId: uid, at: new Date() });
    });
  });
};
