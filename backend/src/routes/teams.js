'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/teamsController');

router.use(auth);

router.get('/',           asyncHandler(ctrl.listMyTeams));
router.post('/',          asyncHandler(ctrl.createTeam));
router.post('/join',      asyncHandler(ctrl.joinTeam));
router.post('/leave',     asyncHandler(ctrl.leaveTeam));
router.get('/mine',       asyncHandler(ctrl.getMyTeam));
router.get('/ranking',    asyncHandler(ctrl.teamRanking));
router.get('/:id',        asyncHandler(ctrl.getTeam));

module.exports = router;
