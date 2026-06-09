'use strict';

const express = require('express');
const router  = express.Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/petsController');

router.use(auth);

router.get('/mine',        ctrl.getMyPet);
router.put('/mine/name',   ctrl.renamePet);
router.put('/mine/mood',   ctrl.updateMood);
router.get('/:userId',     ctrl.getPetByUser);

module.exports = router;
