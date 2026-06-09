'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/feedbackController');

router.post('/',    asyncHandler(ctrl.createFeedback));
router.get('/mine', auth, asyncHandler(ctrl.listMyFeedbacks));

module.exports = router;
