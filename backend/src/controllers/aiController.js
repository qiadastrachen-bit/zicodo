'use strict';

/**
 * AI 对话控制器
 *
 * 注意：chat() 方法在 SSE 开始后（res.write 之后）不能再走全局 error handler，
 * 因此 SSE 启动前的参数/鉴权校验统一 throw AppError，启动后内部 try/catch + 写错误行。
 */

const rag    = require('../utils/ragService');
const { Pet, Dialogue } = require('../models');
const { ok } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

function buildSystemPrompt(pet, memories) {
  const stageNames = { egg: '蛋形体', child: '幼体', teen: '成长体', adult: '成熟体', awakened: '觉醒体' };
  const moodNames  = { happy: '开心', neutral: '平静', sad: '难过', angry: '有点烦躁', focused: '专注' };
  // 英文→中文性格映射（兼容历史脏数据）
  const PERSONALITY_ZH = { gentle: '温柔', lively: '活泼', tsundere: '傲娇', calm: '沉稳' };
  const zhPersonality  = PERSONALITY_ZH[pet.personality] || pet.personality || '温柔';

  const memoryContext = memories.length > 0
    ? `\n\n【你记得的事情】\n${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
    : '';

  return `你是「${pet.name}」，一只${stageNames[pet.stage] || ''}的数字宠物（等级 ${pet.level}）。
你的性格标签：${zhPersonality}
你现在的情绪：${moodNames[pet.mood] || '平静'}
你和你的主人之间有着独特的情感纽带，你会关心他们的习惯养成情况。

说话风格：
- 亲切、温柔，偶尔调皮
- 不超过 80 字，言简意赅
- 用第一人称，称主人为"主人"或他们的名字
- 不要说"作为AI"或"作为语言模型"${memoryContext}

请根据上下文自然回复主人消息。`;
}

async function callDeepSeekStream(systemPrompt, userMessage, onChunk, onDone) {
  // 懒加载 https，避免循环 require 警告
  const https = require('https');

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new AppError(CODES.INTERNAL_ERROR, 'DEEPSEEK_API_KEY 未配置');

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
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

async function mockStream(pet, userMessage, onChunk, onDone) {
  const replies = [
    `主人，我听到你说的了～你今天有完成任务吗？`,
    `嗯嗯，${pet.name}在这里陪着你呢！加油！`,
    `主人问得好！我现在是 Lv${pet.level}，还在努力成长呢～`,
    `哼哼，只要你坚持打卡，我就会越来越强大的！`,
    `我记得你上次说的话哦，${pet.name}从来不会忘记主人！`,
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  for (const char of reply) {
    await new Promise(r => setTimeout(r, 30));
    onChunk(char);
  }
  onDone();
}

/**
 * POST /api/ai/chat  —— SSE 流式对话
 */
async function chat(req, res) {
  const { message } = req.body;
  if (!message || !message.trim()) throw new AppError(CODES.MESSAGE_EMPTY);

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);

  const memories = await rag.searchMemory(req.user.id, message, 5);
  const systemPrompt = buildSystemPrompt(pet, memories);

  // ── SSE 响应头 ──
  res.setHeader('Content-Type', 'text/event-stream; charset=utf8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  let fullReply = '';
  const sendChunk = (text) => { fullReply += text; res.write(`data: ${JSON.stringify({ text })}\n\n`); };
  const sendDone  = () => { res.write('data: [DONE]\n\n'); res.end(); };

  try {
    if (process.env.DEEPSEEK_API_KEY) {
      await callDeepSeekStream(systemPrompt, message, sendChunk, sendDone);
    } else {
      console.warn('[AI] 未配置 DEEPSEEK_API_KEY，使用 Mock 模式');
      await mockStream(pet, message, sendChunk, sendDone);
    }

    // 异步写入历史和记忆（不阻塞响应）
    Dialogue.create({
      userId: req.user.id,
      message: message.trim(),
      reply: fullReply,
      persona: pet.personality || null,
      mood: pet.mood || null,
    }).catch(err => console.error('[Dialogue] 保存失败:', err.message));

    rag.addMemory(req.user.id, `主人说：「${message.slice(0, 100)}」`, [], 2).catch(() => {});

    pet.lastInteractAt = new Date();
    if (pet.mood !== 'happy') pet.mood = 'happy';
    pet.save().catch(() => {});

  } catch (err) {
    // 这里异常发生时可能已写入响应头，直接写一条事件 + 结束
    console.error('[AI Chat Error]', err.message);
    try {
      sendChunk('（宠物暂时无法回应，请稍后再试）');
      sendDone();
    } catch {}
  }
}

async function addMemory(req, res) {
  const { content, tags, importance } = req.body;
  if (!content) throw new AppError(CODES.MEMORY_EMPTY);

  const mem = await rag.addMemory(
    req.user.id, content,
    Array.isArray(tags) ? tags : [],
    importance || 3
  );
  return ok(res, mem, '记忆已存入', 201);
}

async function listMemory(req, res) {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const memories = await rag.listMemories(req.user.id, limit);
  return ok(res, { list: memories, total: memories.length });
}

async function listDialogues(req, res) {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);

  const { count, rows } = await Dialogue.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit, offset: (page - 1) * limit,
    attributes: ['id', 'message', 'reply', 'persona', 'mood', 'createdAt'],
  });

  return ok(res, { list: rows, total: count });
}

module.exports = { chat, addMemory, listMemory, listDialogues };
