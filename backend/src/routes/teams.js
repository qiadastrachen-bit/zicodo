'use strict';

const express = require('express');
const router  = express.Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/teamsController');

router.use(auth);

router.post('/',          ctrl.createTeam);
router.post('/join',      ctrl.joinTeam);
router.post('/leave',     ctrl.leaveTeam);
router.get('/mine',       ctrl.getMyTeam);
router.get('/ranking',    ctrl.teamRanking);
router.get('/:id',        ctrl.getTeam);

module.exports = router;
