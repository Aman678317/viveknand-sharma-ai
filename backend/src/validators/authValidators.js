const { body } = require('express-validator');

const signupRules = [
  body('fullName').trim().isLength({ min: 2, max: 80 }),
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').normalizeEmail().isEmail(),
  body('password').isLength({ min: 8, max: 128 }),
  body('country').optional().trim().isLength({ max: 80 }),
  body('preferredLanguage').optional().isIn(['en', 'hi', 'zh', 'ar', 'es', 'fr'])
];

const loginRules = [
  body('email').normalizeEmail().isEmail(),
  body('password').isLength({ min: 1, max: 128 })
];

module.exports = { signupRules, loginRules };
