const asyncHandler = require('../utils/asyncHandler');
const callService = require('../services/callService');

const history = asyncHandler(async (req, res) => {
  res.json({ success: true, calls: await callService.getCallHistory(req.user._id) });
});

const status = asyncHandler(async (req, res) => {
  res.json({ success: true, iceServers: req.app.locals.iceServers || [] });
});

module.exports = { history, status };
