const Chat = require('../models/Chat');
const Message = require('../models/Message');
const chatService = require('../services/chatService');

function setupChatSockets(io, socket) {
  socket.on('join-chat', async ({ chatId }) => {
    const chat = await Chat.findOne({ _id: chatId, participants: socket.userId });
    if (chat) socket.join(`chat:${chatId}`);
  });

  socket.on('send-message', async ({ chatId, content, targetLanguage }, ack) => {
    try {
      const message = await chatService.sendMessage({ userId: socket.userId, chatId, content, targetLanguage });
      if (!message) return ack?.({ success: false, message: 'Chat not found' });
      const chat = await Chat.findById(chatId).select('participants');
      chat.participants.forEach((participantId) => io.to(`user:${participantId}`).emit('receive-message', message));
      io.to(`chat:${chatId}`).emit('message-delivered', { chatId, messageId: message._id });
      return ack?.({ success: true, message });
    } catch (err) {
      return ack?.({ success: false, message: err.message });
    }
  });

  socket.on('typing-start', ({ chatId }) => socket.to(`chat:${chatId}`).emit('typing-start', { chatId, userId: socket.userId }));
  socket.on('typing-stop', ({ chatId }) => socket.to(`chat:${chatId}`).emit('typing-stop', { chatId, userId: socket.userId }));

  socket.on('message-read', async ({ chatId, messageId }) => {
    await Message.findOneAndUpdate(
      { _id: messageId, chat: chatId },
      { $addToSet: { readBy: socket.userId }, status: 'read' },
      { new: true }
    );
    socket.to(`chat:${chatId}`).emit('message-read', { chatId, messageId, userId: socket.userId, readAt: new Date() });
  });
}

module.exports = setupChatSockets;
