const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { translateMessage } = require('./translationService');

async function findOrCreateDirectChat(userId, participantId) {
  let chat = await Chat.findOne({ type: 'direct', participants: { $all: [userId, participantId], $size: 2 } });
  if (!chat) chat = await Chat.create({ type: 'direct', participants: [userId, participantId] });
  return chat.populate('participants', 'fullName username profileImage preferredLanguage online lastSeenAt');
}

async function listChats(userId) {
  return Chat.find({ participants: userId })
    .populate('participants', 'fullName username profileImage preferredLanguage online lastSeenAt')
    .populate('lastMessage')
    .sort({ lastActivityAt: -1 })
    .limit(100);
}

async function getMessages(userId, chatId, { cursor, limit = 40 } = {}) {
  const chat = await Chat.findOne({ _id: chatId, participants: userId });
  if (!chat) return null;
  const query = { chat: chatId };
  if (cursor) query.createdAt = { $lt: new Date(cursor) };
  return Message.find(query).populate('sender', 'fullName username profileImage').sort({ createdAt: -1 }).limit(Number(limit));
}

async function sendMessage({ userId, chatId, content, targetLanguage }) {
  const chat = await Chat.findOne({ _id: chatId, participants: userId }).populate('participants', 'preferredLanguage');
  if (!chat) return null;
  const sender = chat.participants.find((p) => p._id.toString() === userId.toString());
  const receiver = chat.participants.find((p) => p._id.toString() !== userId.toString());
  const language = targetLanguage || receiver?.preferredLanguage || 'en';
  const translated = await translateMessage(content, language, sender?.preferredLanguage || 'auto');
  const message = await Message.create({
    chat: chatId,
    sender: userId,
    originalContent: content,
    sourceLanguage: translated.sourceLanguage,
    targetLanguage: language,
    translatedContent: translated.translated,
    translations: [{ language, content: translated.translated, provider: translated.provider, cached: translated.cached }]
  });
  chat.lastMessage = message._id;
  chat.lastActivityAt = new Date();
  await chat.save();
  return message.populate('sender', 'fullName username profileImage');
}

async function searchUsers(userId, q) {
  const query = q ? { $text: { $search: q }, _id: { $ne: userId } } : { _id: { $ne: userId } };
  return User.find(query).select('fullName username email profileImage country preferredLanguage online lastSeenAt').limit(25);
}

module.exports = { findOrCreateDirectChat, listChats, getMessages, sendMessage, searchUsers };
