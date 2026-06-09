'use strict';

const express = require('express');
const router  = express.Router();
const { auth } = require('../middleware/auth');
const { getLogs, getBalance, leaderboard } = require('../controllers/pointsController');

router.use(auth);

router.get('/balance',     getBalance);
router.get('/logs',        getLogs);
router.get('/leaderboard', leaderboard);

module.exports = router;
