'use strict';

const express    = require('express');
const router     = express.Router();
const { auth }   = require('../middleware/auth');
const aiCtrl     = require('../controllers/aiController');

router.use(auth);

// POST /api/ai/chat  —— 宠物 AI 对话（SSE 流式输出）
router.post('/chat', aiCtrl.chat);

// POST /api/ai/memory  —— 向 RAG 记忆库存入用户信息
router.post('/memory', aiCtrl.addMemory);

// GET  /api/ai/memory  —— 查询宠物记忆（调试用）
router.get('/memory', aiCtrl.listMemory);

module.exports = router;
