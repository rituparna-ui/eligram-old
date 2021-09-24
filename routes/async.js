const express = require('express');
const router = express.Router();

const isAuth = require('./../utils/auth');

const asyncController = require('./../controllers/async');

router.post('/changepwd',asyncController.changepwd)

router.post('/follow', isAuth, asyncController.postFollow);

router.post('/like', isAuth, (req, res) => {});

module.exports = router;
