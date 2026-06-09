'use strict';

/**
 * 字灵宠物端对接路由 —— 路径前缀：/ziling/api
 *
 * 接口：
 *   GET  /ping            健康检查
 *   POST /schedule        日程反馈 -> 生成陪伴语
 *   POST /chat            对话态（核心，走大模型）
 *   POST /validate        组词判定（两字是否组成常用词）
 */

const express = require('express');
const router  = express.Router();
const https   = require('https');

const { asyncHandler } = require('../middleware/error');
const { Pet, Dialogue } = require('../models');
const { ok } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');
const { YANWENZI_ALL, safeYanwenzi } = require('../utils/yanwenzi');

const COMMON_WORDS = new Set([
  '明天','开心','学习','跑步','完成','坚持','努力','健康','快乐','休息',
  '朋友','家人','时间','计划','目标','进步','成长','习惯','打卡','积分',
  '宠物','字灵','互动','游戏','挑战','成功','失败','继续','开始','结束',
]);

// 英文→中文性格标签映射（兼容历史脏数据，缓解 personality 字段格式不统一问题）
const PERSONALITY_ZH = {
  gentle: '温柔',
  lively: '活泼',
  tsundere: '傲娇',
  calm: '沉稳',
};

function toChinesePersona(p) {
  if (!p) return null;
  if (PERSONALITY_ZH[p]) return PERSONALITY_ZH[p];
  return p; // 已经是中文或其他值，原样返回
}

function callLLM(systemPrompt, userMessage, history) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return reject(new AppError(CODES.INTERNAL_ERROR, 'DEEPSEEK_API_KEY 未配置'));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history.filter(h => h.role && h.content) : []),
      { role: 'user',   content: userMessage },
    ];

    const body = JSON.stringify({
      model: process.env.AI_MODEL || 'deepseek-chat',
      messages,
    });

    const req = https.request({
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json?.choices?.[0]?.message?.content || '';
          resolve(text);
        } catch (e) { reject(new AppError(CODES.INTERNAL_ERROR, 'LLM 响应解析失败')); }
      });
    });
    req.on('error', () => reject(new AppError(CODES.INTERNAL_ERROR, 'LLM 调用失败')));
    req.write(body);
    req.end();
  });
}

// ─── 健康检查（同步，不需要 asyncHandler） ────────────
router.get('/ping', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── POST /schedule  日程反馈 ──────────────────────────
async function scheduleHandler(req, res) {
  const { completed = [], pending = [], delayed = [], persona } = req.body;

  const sys = `你是「字灵」，一个汉字精灵宠物。
${persona ? `你的性格：${persona}。` : ''}
根据用户今日的日程完成情况，输出一段简短陪伴语（≤30字，中文），以及一个颜文字。
颜文字只能从以下白名单选：${YANWENZI_ALL.join('、')}。
输出严格按 JSON 格式：{"message":"...","emoji":"..."}，不要输出其他内容。`;

  const userSummary = [
    `今日完成：${completed.map(t => t.title).join('、') || '无'}`,
    `待办：${pending.map(t => t.title).join('、') || '无'}`,
    `已延期：${delayed.map(t => t.title).join('、') || '无'}`,
  ].join('；');

  let parsed = null;
  try {
    const raw = await callLLM(sys, userSummary, []);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse((jsonMatch || [])[0] || '{}');
  } catch (e) { console.warn('[schedule] LLM 失败，使用兜底', e.message); }

  const message = parsed?.message?.slice(0, 30) || '今天也辛苦了，休息一下吧～';
  const emoji   = safeYanwenzi(parsed?.emoji);

  return ok(res, { message, emoji });
}

// ─── POST /chat  核心对话 ───────────────────────────────
async function chatHandler(req, res) {
  const { message, history = [], schedule } = req.body;
  let persona = req.body.persona;
  if (!message || !message.trim()) throw new AppError(CODES.MESSAGE_EMPTY);

  let petName   = '字灵';
  let petStage  = 'child';
  let userId    = null;

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      const pet = await Pet.findOne({ where: { userId: decoded.id } });
      if (pet) {
        petName = pet.name;
        petStage = pet.stage;
        // 风险缓解：如果前端未传 persona，从宠物数据中取 personality 作为 fallback
        if (!persona && pet.personality) persona = pet.personality;
      }
    }
  } catch { /* 未登录也允许 */ }

  const stageNames = { egg:'蛋形体', child:'幼体', teen:'成长体', adult:'成熟体', awakened:'觉醒体' };

  // 确保 persona 始终为中文（兼容历史脏数据）
  persona = toChinesePersona(persona);

  const sys = `你是「${petName}」，一只${stageNames[petStage] || '幼体'}的数字汉字精灵宠物。
${persona ? `性格设定：${persona}。` : '性格：亲切、偶尔调皮，像真正的宠物一样关心主人。'}
说话风格：
- 用第一人称"我"，称对方"主人"
- 输出一个纯 JSON 对象（不要输出 JSON 以外内容，不要加 \`\`\`json 标记）：
  {"quickReply":"...","megachar":{"chars":["字"],"direction":"vertical","rotateInterval":0,"duration":3000},"stream":[{"text":"...","emoji":"..."}]}
- quickReply：一句话简洁回复（≤20字）
- megachar.chars：1~4 个汉字
- megachar.direction：字数≤2用"vertical"，≥3用"horizontal"
- stream：3~5 段轮流展示的内容，每段包含 text（≤30字）、emoji（白名单内）
- 颜文字白名单：${YANWENZI_ALL.join('、')}
${schedule ? '\n\n【今日日程参考】\n完成：' + (schedule.completed||[]).map(t=>t.title).join('、') + '\n待办：' + (schedule.pending||[]).map(t=>t.title).join('、') : ''}`;

  let parsed = null;
  try {
    const raw = await callLLM(sys, message, history);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch (e) { console.warn('[chat] LLM 调用/解析失败', e.message); }

  const result = {
    quickReply: parsed?.quickReply?.slice(0, 20) || '我在呢～',
    megachar: {
      chars:          Array.isArray(parsed?.megachar?.chars) ? parsed.megachar.chars.slice(0, 4) : ['好'],
      direction:      parsed?.megachar?.direction === 'horizontal' ? 'horizontal' : 'vertical',
      rotateInterval: Number(parsed?.megachar?.rotateInterval) || 0,
      duration:       Math.min(Number(parsed?.megachar?.duration) || 3000, 5000),
    },
    stream: Array.isArray(parsed?.stream) ? parsed.stream.slice(0, 5).map(s => ({
      text: (s.text || '...').slice(0, 30),
      emoji: safeYanwenzi(s.emoji),
      ...(s.word ? { word: s.word.slice(0, 4) } : {}),
    })) : [
      { text: '我在听你说呢～', emoji: '^_^' },
      { text: '继续说吧，我都在', emoji: '(^_^)/' },
    ],
  };

  if (userId) {
    const fullReply = [result.quickReply, ...result.stream.map(s => s.text)].join(' ');
    Dialogue.create({
      userId,
      message: message.trim().slice(0, 500),
      reply: fullReply.slice(0, 1000),
      persona: persona || null,
      mood: null,
    }).catch(err => console.error('[Dialogue] 保存失败:', err.message));
  }

  return ok(res, result);
}

// ─── POST /validate  组词判定 ───────────────────────────
async function validateHandler(req, res) {
  const { char1, char2 } = req.body;
  if (!char1 || !char2) return ok(res, { valid: false });

  const w1 = char1 + char2;
  const w2 = char2 + char1;

  if (COMMON_WORDS.has(w1) || COMMON_WORDS.has(w2)) {
    return ok(res, { valid: true, word: COMMON_WORDS.has(w1) ? w1 : w2 });
  }

  try {
    const sys = `你是一个组词判定工具。用户给出两个字，判断是否能组成一个常见中文词。只回答 YES 或 NO，不要解释。`;
    const raw = await callLLM(sys, `这两个字能组词吗：${char1} ${char2}`, []);
    const valid = /YES/i.test(raw);
    return ok(res, { valid });
  } catch {
    return ok(res, { valid: false });
  }
}

router.post('/schedule', asyncHandler(scheduleHandler));
router.post('/chat',     asyncHandler(chatHandler));
router.post('/validate', asyncHandler(validateHandler));

module.exports = router;
