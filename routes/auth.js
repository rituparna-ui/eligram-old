const { body } = require('express-validator');

const authController = require('./../controllers/auth');
const authGuard = require('./../utils/auth');

const express = require('express');
const router = express.Router();

router.post('/2fa', authGuard, authController.post2fa);

router.post('/disable2fa', authGuard, authController.disable2fa);

router.post('/verify2fa', authController.verify2fa);

router.post('/deleteaccount', authGuard, authController.postDeleteAccount);

router.get('/logout', authController.logout);

router.get('/verify/:id', authController.getVerifyOTP);

router.post('/verify', authController.postResendOTP);

router.get('/login', authController.getLogin);

router.post('/login', [body('email').trim()], authController.postLogin);

router.get('/signup', authController.getSignUp);

router.post('/enable2fa', authGuard, authController.postEnable2fa);

router.get('/forgotpassword', authController.getForgotPassword);

router.post('/forgotpassword', authController.postForgotPassword);

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
