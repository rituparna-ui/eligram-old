const { body } = require('express-validator');

const authController = require('./../controllers/auth');

const express = require('express');
const router = express.Router();

router.get('/signup', authController.getSignUp);

router.post(
  '/signup',
  [
    body('firstname').isString().withMessage('Enter a valid first name').trim(),
    body('lastname').isString().withMessage('Enter a valid last name').trim(),
    body('email').isEmail().withMessage('Enter a valid email id').trim(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Your password should be at least 8 characters')
      .trim(),
  ],
  authController.postSignUp
);

module.exports = router;
