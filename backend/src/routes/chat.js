const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const controller = require('../controllers/chatController');
const { createChatRules, sendMessageRules, messagesRules } = require('../validators/chatValidators');

router.use(auth);
router.get('/', controller.listChats);
router.post('/create', createChatRules, validate, controller.createChat);
router.get('/messages/:chatId', messagesRules, validate, controller.getMessages);
router.post('/send', sendMessageRules, validate, controller.send);

module.exports = router;
