'use strict';

/**
 * AI 对话控制器
 * ─────────────────────────────────────────────────────────
 * 支持：
 *   1. DeepSeek —— 配置 DEEPSEEK_API_KEY（SSE 流式输出）
 *   2. Mock 模式 —— 未配置 Key 时自动 fallback，答辩演示可用
 *
 * POST /api/ai/chat
 *   body: { message: string }
 *   响应：SSE 流式文本 (text/event-stream)
 */

const https  = require('https');
const http   = require('http');
const rag    = require('../utils/ragService');
const { Pet } = require('../models');
const { fail } = require('../utils/helpers');

// ─── 宠物人设 Prompt ──────────────────────────────────────
function buildSystemPrompt(pet, memories) {
  const stageNames = {
    egg: '蛋形体', child: '幼体', teen: '成长体', adult: '成熟体', awakened: '觉醒体',
  };
  const moodNames = {
    happy: '开心', neutral: '平静', sad: '难过', angry: '有点烦躁', focused: '专注',
  };

  const memoryContext = memories.length > 0
    ? `\n\n【你记得的事情】\n${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
    : '';

  return `你是「${pet.name}」，一只${stageNames[pet.stage] || ''}的数字宠物（等级 ${pet.level}）。
你的性格标签：${pet.personality}
你现在的情绪：${moodNames[pet.mood] || '平静'}
你和你的主人之间有着独特的情感纽带，你会关心他们的习惯养成情况。

说话风格：
- 亲切、温柔，偶尔调皮
- 不超过 80 字，言简意赅
- 用第一人称，称主人为"主人"或他们的名字
- 不要说"作为AI"或"作为语言模型"${memoryContext}

请根据上下文自然回复主人的消息。`;
}

/**
 * DeepSeek API 流式调用（SSE）
 */
async function callDeepSeekStream(systemPrompt, userMessage, onChunk, onDone) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未配置');

  const body = JSON.stringify({
    model: process.env.AI_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage },
    ],
    stream: true,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.deepseek.com',
      path:     '/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    }, (res) => {
      res.setEncoding('utf8');
      let buffer = '';
      res.on('data', chunk => {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data === '[DONE]') { onDone(); return; }
            try {
              const json = JSON.parse(data);
              const text = json?.choices?.[0]?.delta?.content || '';
              if (text) onChunk(text);
            } catch {}
          }
        }
      });
      res.on('end', () => { onDone(); resolve(); });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Mock 模式（无 API Key 时的 fallback）
 * 返回预设回复，用于演示
 */
async function mockStream(pet, userMessage, onChunk, onDone) {
  const replies = [
    `主人，我听到你说的了～你今天有完成任务吗？`,
    `嗯嗯，${pet.name}在这里陪着你呢！加油！`,
    `主人问得好！我现在是 Lv${pet.level}，还在努力成长呢～`,
    `哼哼，只要你坚持打卡，我就会越来越强大的！`,
    `我记得你上次说的话哦，${pet.name}从来不会忘记主人！`,
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];

  // 模拟流式输出
  for (const char of reply) {
    await new Promise(r => setTimeout(r, 30));
    onChunk(char);
  }
  onDone();
}

/**
 * POST /api/ai/chat
 */
async function chat(req, res) {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return fail(res, '消息不能为空');
  }

  // 获取宠物信息
  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) return fail(res, '找不到你的宠物', 404);

  // RAG：检索相关记忆
  const memories = await rag.searchMemory(req.user.id, message, 5);

  // 构建系统 prompt
  const systemPrompt = buildSystemPrompt(pet, memories);

  // ─── SSE 设置 ──────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const sendChunk = (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  };
  const sendDone = () => {
    res.write('data: [DONE]\n\n');
    res.end();
  };

  try {
    if (process.env.DEEPSEEK_API_KEY) {
      await callDeepSeekStream(systemPrompt, message, sendChunk, sendDone);
    } else {
      console.warn('[AI] 未配置 DEEPSEEK_API_KEY，使用 Mock 模式');
      await mockStream(pet, message, sendChunk, sendDone);
    }

    // ─── 自动存入记忆 ──────────────────────────────────────
    // 将本次对话摘要存入 RAG，下次可以回忆
    const summary = `主人说：「${message.slice(0, 100)}」`;
    await rag.addMemory(req.user.id, summary, [], 2).catch(() => {});

    // 更新宠物互动时间和情绪
    pet.lastInteractAt = new Date();
    if (pet.mood !== 'happy') { pet.mood = 'happy'; }
    await pet.save().catch(() => {});

  } catch (err) {
    console.error('[AI Chat Error]', err.message);
    sendChunk('（宠物暂时无法回应，请稍后再试）');
    sendDone();
  }
}

/**
 * POST /api/ai/memory
 * 手动向记忆库存入信息
 * body: { content, tags?: string[], importance?: 1-5 }
 */
async function addMemory(req, res) {
  const { content, tags, importance } = req.body;
  if (!content) return fail(res, '记忆内容不能为空');

  const mem = await rag.addMemory(
    req.user.id,
    content,
    Array.isArray(tags) ? tags : [],
    importance || 3
  );
  const { ok } = require('../utils/helpers');
  return ok(res, mem, '记忆已存入', 201);
}

/**
 * GET /api/ai/memory
 * 列出当前用户的所有宠物记忆
 */
async function listMemory(req, res) {
  const mems = await rag.listMemories(req.user.id);
  const { ok } = require('../utils/helpers');
  return ok(res, mems);
}

module.exports = { chat, addMemory, listMemory };
