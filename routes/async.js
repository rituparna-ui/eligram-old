const express = require('express');
const router = express.Router();

const asyncController = require('./../controllers/async');

router.post('/follow', asyncController.postFollow);

module.exports = router;
