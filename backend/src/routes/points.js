'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const {
  getLogs, getBalance, leaderboard, earnPointsHandler, spendPointsHandler,
} = require('../controllers/pointsController');

router.use(auth);

router.get('/balance',     asyncHandler(getBalance));
router.get('/logs',        asyncHandler(getLogs));
router.get('/leaderboard', asyncHandler(leaderboard));
router.post('/earn',       asyncHandler(earnPointsHandler));
router.post('/spend',      asyncHandler(spendPointsHandler));

module.exports = router;
