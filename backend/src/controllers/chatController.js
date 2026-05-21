const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const chatService = require('../services/chatService');

const createChat = asyncHandler(async (req, res) => {
  const chat = await chatService.findOrCreateDirectChat(req.user._id, req.body.participantId);
  res.status(201).json({ success: true, chat });
});

const listChats = asyncHandler(async (req, res) => {
  res.json({ success: true, chats: await chatService.listChats(req.user._id) });
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await chatService.getMessages(req.user._id, req.params.chatId, req.query);
  if (!messages) throw new ApiError(404, 'Chat not found');
  res.json({ success: true, messages: messages.reverse() });
});

const send = asyncHandler(async (req, res) => {
  const message = await chatService.sendMessage({ userId: req.user._id, ...req.body });
  if (!message) throw new ApiError(404, 'Chat not found');
  res.status(201).json({ success: true, message });
});

module.exports = { createChat, listChats, getMessages, send };
