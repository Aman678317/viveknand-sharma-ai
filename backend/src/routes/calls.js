const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/callController');

router.use(auth);
router.get('/history', controller.history);
router.get('/status', controller.status);

module.exports = router;
