'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/usersController');

router.use(auth);

router.get('/me', asyncHandler(ctrl.getProfile));
router.put('/me', asyncHandler(ctrl.updateProfile));
router.post('/me/password', asyncHandler(ctrl.changePassword));

module.exports = router;
