'use strict';

const express = require('express');
const router  = express.Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/tasksController');

// 所有任务接口都需要登录
router.use(auth);

router.get('/',         ctrl.listTasks);
router.post('/',        ctrl.createTask);
router.get('/:id',      ctrl.getTask);
router.put('/:id',      ctrl.updateTask);
router.delete('/:id',   ctrl.deleteTask);
router.post('/:id/check', ctrl.checkTask);  // 打卡

module.exports = router;
