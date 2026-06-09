'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const { register, login, autoLogin, me } = require('../controllers/authController');

router.post('/register',   asyncHandler(register));
router.post('/login',      asyncHandler(login));
router.post('/auto-login', asyncHandler(autoLogin));
router.get('/me',          auth, asyncHandler(me));

module.exports = router;
