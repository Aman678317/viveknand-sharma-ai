const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const controller = require('../controllers/translationController');

router.use(auth);
router.post('/message', [
  body('text').trim().isLength({ min: 1, max: 4000 }),
  body('targetLanguage').isIn(['en', 'hi', 'zh', 'ar', 'es', 'fr']),
  body('sourceLanguage').optional().isString()
], validate, controller.translate);

module.exports = router;
