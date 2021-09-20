const express = require('express');
const router = express.Router();

const homeController = require('./../controllers/home');
const authGuard = require('./../utils/auth');

router.get('/', authGuard, homeController.getHome);

module.exports = router;
