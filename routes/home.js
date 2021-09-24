const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');

const homeController = require('./../controllers/home');
const authGuard = require('./../utils/auth');

router.get('/', authGuard, homeController.getHome);

router.get('/profile/:username', homeController.getProfile);

router.get('/settings', authGuard, homeController.getSettings);

router.post(
  '/settings',
  authGuard,
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
    body('username')
      .isLength({ min: 1 })
      .withMessage('Your username should be at least 1 characters')
      .trim(),
    body('bio')
      .isLength({ min: 1 })
      .withMessage('Your bio cannot be empty')
      .trim(),
  ],
  homeController.postSettings
);

module.exports = router;
