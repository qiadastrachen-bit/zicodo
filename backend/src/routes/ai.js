'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const aiCtrl = require('../controllers/aiController');

router.use(auth);

router.post('/chat',      asyncHandler(aiCtrl.chat));
router.post('/memory',    asyncHandler(aiCtrl.addMemory));
router.get('/memory',     asyncHandler(aiCtrl.listMemory));
router.get('/dialogues',  asyncHandler(aiCtrl.listDialogues));

module.exports = router;
