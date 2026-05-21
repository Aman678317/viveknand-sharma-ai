const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/userController');

router.use(auth);
router.get('/profile', controller.getProfile);
router.patch('/profile', controller.updateProfile);
router.get('/search', controller.search);
router.get('/status', controller.status);

module.exports = router;
