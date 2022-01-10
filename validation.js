const { check } = require('express-validator');

exports.signupValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Include a valid email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check('password', 'Passwd must be 6 or more chars').isLength({ min: 6 }),
];

exports.loginValidation = [
  check('email', 'Include a valid email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check('password', 'Passwd must be 6 or more chars').isLength({
    min: 6,
  }),
];
