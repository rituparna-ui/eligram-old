const { body } = require('express-validator');

const authController = require('./../controllers/auth');

const express = require('express');
const router = express.Router();

router.post('/2fa', authController.post2fa);

router.post('/disable2fa',authController.disable2fa)

router.post('/verify2fa', authController.verify2fa);

router.post('/deleteaccount', authController.postDeleteAccount);

router.get('/logout', authController.logout);

router.get('/verify/:id', authController.getVerifyOTP);

router.post('/verify', authController.postResendOTP);

router.get('/login', authController.getLogin);

router.post('/login', [body('email').trim()], authController.postLogin);

router.get('/signup', authController.getSignUp);

router.post('/enable2fa', authController.postEnable2fa);

router.post(
  '/signup',
  [
    body('firstname')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Enter a valid first name')
      .trim(),
    body('lastname')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Enter a valid last name')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Enter a valid email id')
      .trim()
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Your password should be at least 8 characters')
      .trim(),
    body('username')
      .isLength({ min: 1 })
      .withMessage('Your username should be at least 1 characters')
      .trim(),
  ],
  authController.postSignUp
);

module.exports = router;
