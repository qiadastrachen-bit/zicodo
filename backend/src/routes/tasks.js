'use strict';

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/tasksController');

router.use(auth);

router.get('/',              asyncHandler(ctrl.listTasks));
router.post('/',             asyncHandler(ctrl.createTask));
router.get('/:id',           asyncHandler(ctrl.getTask));
router.put('/:id',           asyncHandler(ctrl.updateTask));
router.delete('/:id',        asyncHandler(ctrl.deleteTask));
router.post('/:id/check',    asyncHandler(ctrl.checkTask));

module.exports = router;
