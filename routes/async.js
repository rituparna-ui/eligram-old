const express = require('express');
const router = express.Router();

const User = require('./../models/user.model');

const isAuth = require('./../utils/auth');

const asyncController = require('./../controllers/async');

router.post('/changepwd', isAuth, asyncController.changepwd);

router.post('/follow', isAuth, asyncController.postFollow);

router.post('/like', isAuth, (req, res) => {});

router.post('/push', isAuth, async (req, res) => {
  req.user.push = req.body.sub;
  await req.user.save();
  return res.end();
});

module.exports = router;
