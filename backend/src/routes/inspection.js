'use strict';

/**
 * 检查执行记录路由
 *
 * POST /api/inspection-runs      创建一条记录（可选登录）
 * GET  /api/inspection-runs      分页列出所有记录
 * GET  /api/inspection-runs/:id  获取单条详情
 */

const express = require('express');
const router  = express.Router();
const { asyncHandler } = require('../middleware/error');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/inspectionController');

// 可选鉴权：有 token 时绑定用户，无 token 时匿名
router.use((req, res, next) => {
  if (!req.headers.authorization) return next();
  auth(req, res, next);
});

router.post('/',    asyncHandler(ctrl.createRun));
router.get('/',     asyncHandler(ctrl.listRuns));
router.get('/:id',  asyncHandler(ctrl.getRun));

module.exports = router;
