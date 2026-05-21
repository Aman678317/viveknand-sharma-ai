const callService = require('../services/callService');

function setupCallSockets(io, socket, { redisClient }) {
  socket.on('call-user', async ({ to, type = 'video', metadata }, ack) => {
    const call = await callService.createCall({ caller: socket.userId, receiver: to, type });
    if (redisClient?.isOpen) await redisClient.set(`call:${call._id}`, JSON.stringify({ caller: socket.userId, receiver: to, type }), { EX: 60 * 60 });
    io.to(`user:${to}`).emit('incoming-call', { callId: call._id, from: socket.userId, type, metadata });
    ack?.({ success: true, call });
  });

  socket.on('accept-call', async ({ callId, to }) => {
    await callService.acceptCall(callId);
    io.to(`user:${to}`).emit('accept-call', { callId, from: socket.userId });
  });

  socket.on('reject-call', async ({ callId, to }) => {
    await callService.finishCall(callId, 'rejected');
    io.to(`user:${to}`).emit('reject-call', { callId, from: socket.userId });
  });

  socket.on('offer', ({ to, callId, sdp }) => io.to(`user:${to}`).emit('offer', { from: socket.userId, callId, sdp }));
  socket.on('answer', ({ to, callId, sdp }) => io.to(`user:${to}`).emit('answer', { from: socket.userId, callId, sdp }));
  socket.on('ice-candidate', ({ to, callId, candidate }) => io.to(`user:${to}`).emit('ice-candidate', { from: socket.userId, callId, candidate }));
  socket.on('reconnect-call', ({ to, callId }) => io.to(`user:${to}`).emit('reconnect-call', { from: socket.userId, callId }));

  socket.on('end-call', async ({ callId, to, networkQuality }) => {
    await callService.finishCall(callId, 'completed', networkQuality);
    if (redisClient?.isOpen) await redisClient.del(`call:${callId}`);
    io.to(`user:${to}`).emit('end-call', { callId, from: socket.userId });
  });
}

module.exports = setupCallSockets;
