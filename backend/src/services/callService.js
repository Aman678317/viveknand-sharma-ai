const Call = require('../models/Call');

async function createCall({ caller, receiver, type }) {
  return Call.create({ caller, receiver, type, status: 'ringing', startedAt: new Date() });
}

async function acceptCall(callId) {
  return Call.findByIdAndUpdate(callId, { status: 'ongoing', acceptedAt: new Date() }, { new: true });
}

async function finishCall(callId, status = 'completed', networkQuality) {
  const call = await Call.findById(callId);
  if (!call) return null;
  call.status = status;
  call.endedAt = new Date();
  call.networkQuality = networkQuality || call.networkQuality;
  const start = call.acceptedAt || call.startedAt || call.createdAt;
  call.durationSeconds = Math.max(0, Math.round((call.endedAt - start) / 1000));
  return call.save();
}

async function getCallHistory(userId) {
  return Call.find({ $or: [{ caller: userId }, { receiver: userId }] })
    .populate('caller receiver', 'fullName username profileImage')
    .sort({ createdAt: -1 })
    .limit(100);
}

module.exports = { createCall, acceptCall, finishCall, getCallHistory };
