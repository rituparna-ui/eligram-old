const express = require('express');
const router = express.Router();

const authGuard = require('./../utils/auth');

const postController = require('./../controllers/post');

router.get('/new', authGuard, postController.getNewPost);

router.post('/new', authGuard, postController.postNewPost);

module.exports = router;
