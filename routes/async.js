const express = require('express');
const router = express.Router();

const isAuth = require('./../utils/auth');

const asyncController = require('./../controllers/async');

router.post('/follow', isAuth, asyncController.postFollow);

module.exports = router;
