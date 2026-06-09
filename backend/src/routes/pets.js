'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/petsController');

router.use(auth);

router.get('/mine',         asyncHandler(ctrl.getMyPet));
router.put('/mine/name',  asyncHandler(ctrl.renamePet));
router.put('/mine/mood',  asyncHandler(ctrl.updateMood));
router.put('/mine',        asyncHandler(ctrl.updatePetSettings));
router.post('/mine/feed', asyncHandler(ctrl.feedPet));
router.get('/:userId',    asyncHandler(ctrl.getPetByUser));

module.exports = router;
