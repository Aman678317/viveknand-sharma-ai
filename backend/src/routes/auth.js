const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const controller = require('../controllers/authController');
const { signupRules, loginRules } = require('../validators/authValidators');

router.post('/signup', signupRules, validate, controller.signup);
router.post('/login', loginRules, validate, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', auth, controller.me);

module.exports = router;
