'use strict';

/**
 * 字灵宠物端对接路由
 * 路径前缀：/ziling/api
 *
 * 实现 4 个接口（后端对接文档.md 定义）：
 *   GET  /ping       ─ 健康检查
 *   POST /schedule   ─ 互动态·日程反馈
 *   POST /chat       ─ 对话态·三阶段（核心）
 *   POST /validate   ─ 游戏态·组词判定（可选增强）
 */

const express = require('express');
const router = express.Router();
const https  = require('https');
const { Pet } = require('../models');
const { fail, ok } = require('../utils/helpers');

// ─── 颜文字白名单（后端对接文档 §4）────────────────────────────
const EMOJI_WHITELIST = new Set([
  '^_^', '≥▽≤', '-_-', '(^_^)/',
  'T_T', 'Q_Q', 'U_U', '>_<',
  '≥﹏≤', '¬_¬', '=_=', '⊙_⊙',
  '^o^', '^.^',
]);

function safeEmoji(e) {
  return EMOJI_WHITELIST.has(e) ? e : '^_^';
}

// ─── 调用 LLM（支持 DeepSeek / DashScope）────────────────────────────
function callLLM(systemPrompt, userMessage, history) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) return reject(new Error('API_KEY 未配置'));

    const provider = (process.env.AI_PROVIDER || 'deepseek').toLowerCase();
    const model   = process.env.AI_MODEL || 'deepseek-chat';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history.filter(h => h.role && h.content) : []),
      { role: 'user', content: userMessage },
    ];

    if (provider === 'deepseek') {
      // ── DeepSeek（OpenAI 兼容格式）──
      const body = JSON.stringify({ model, messages });
      const req = https.request({
        hostname: 'api.deepseek.com',
        path:     '/v1/chat/completions',
        method:   'POST',
        headers: {
          'Content-Type':  'application/json',
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
          } catch (e) { reject(new Error('DeepSeek 响应解析失败: ' + e.message)); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    } else {
      // ── DashScope / 通义千问 ──
      const body = JSON.stringify({
        model,
        input: { messages },
        parameters: { result_format: 'message' },
      });
      const req = https.request({
        hostname: 'dashscope.aliyuncs.com',
        path:     '/api/v1/services/aigc/text-generation/generation',
        method:   'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }, res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const text = json?.output?.choices?.[0]?.message?.content || '';
            resolve(text);
          } catch (e) { reject(new Error('DashScope 响应解析失败: ' + e.message)); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    }
  });
}

// ─── 1. GET /ziling/api/ping ─────────────────────────────────────
router.get('/ping', (_req, res) => {
  res.json({ status: 'ok' });
});

// ─── 2. POST /ziling/api/schedule ───────────────────────────────
/**
 * 请求体：{ completed:[{title,time}], pending:[{title,deadline}], delayed:[{title,reason}], persona?:string }
 * 响应体：{ message:"...", emoji:"..." }
 */
router.post('/schedule', async (req, res) => {
  try {
    const { completed = [], pending = [], delayed = [], persona } = req.body;

    const sys = `你是「字灵」，一个汉字精灵宠物。
${persona ? `你的性格：${persona}。` : ''}
根据用户今日的日程完成情况，输出一段简短陪伴语（≤30字，中文），以及一个颜文字。
颜文字只能从以下白名单选：${[...EMOJI_WHITELIST].join('、')}。
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
    } catch (e) { console.error('[schedule] LLM 失败', e.message); }

    const message = parsed?.message?.slice(0, 30) || '今天也辛苦了，休息一下吧～';
    const emoji  = safeEmoji(parsed?.emoji);

    return ok(res, { message, emoji });
  } catch (err) {
    console.error('[schedule]', err.message);
    return ok(res, { message: '今天也辛苦了，注意休息～', emoji: '^_^' });
  }
});

// ─── 3. POST /ziling/api/chat ── 核心 ───────────────────────
/**
 * 请求体：
 *   { message, history?:[{role,content}], persona?:string, schedule?:{completed,pending,delayed} }
 *
 * 响应体（JSON，非 SSE）：
 *   {
 *     quickReply : "简洁回复（≤20字）",
 *     megachar  : { chars:["字"], direction:"vertical"|"horizontal", rotateInterval:0, duration:3000 },
 *     stream     : [ { text:"...", emoji:"...", word?:"..." } ]
 *   }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], persona, schedule } = req.body;
    if (!message || !message.trim()) return fail(res, '消息不能为空');

    // 尝试从 token 获取用户信息（宠物端可选登录）
    let petName = '字灵';
    let petStage = 'child';
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const pet = await Pet.findOne({ where: { userId: decoded.id } });
        if (pet) { petName = pet.name; petStage = pet.stage; }
      }
    } catch {
      // 未登录也允许对话（使用默认人设）
    }

    const stageNames = { egg:'蛋形体', child:'幼体', teen:'成长体', adult:'成熟体', awakened:'觉醒体' };

    const sys = `你是「${petName}」，一只${stageNames[petStage] || '幼体'}的数字汉字精灵宠物。
${persona ? `性格设定：${persona}。` : '性格：亲切、偶尔调皮，像真正的宠物一样关心主人。'}
说话风格：
- 用第一人称"我"，称对方"主人"
- 输出一个纯 JSON 对象（不要输出任何 JSON 以外的内容，不要加 \`\`\`json 标记）：
  {"quickReply":"...","megachar":{"chars":["字"],"direction":"vertical","rotateInterval":0,"duration":3000},"stream":[{"text":"...","emoji":"..."}]}
- quickReply：一句话简洁回复（≤20字）
- megachar.chars：1~4个汉字
- megachar.direction：字数≤2用"vertical"，≥3用"horizontal"
- stream：3~5段轮流展示的内容，每段包含 text（≤30字）、emoji（必须从白名单选）
- 颜文字白名单：${[...EMOJI_WHITELIST].join('、')}
- stream 数组长度 3~5，每段 text ≤30 字${schedule ? '\n\n【今日日程参考】\n完成：' + (schedule.completed||[]).map(t=>t.title).join('、') + '\n待办：' + (schedule.pending||[]).map(t=>t.title).join('、') : ''}`;

    let parsed = null;
    try {
      const raw = await callLLM(sys, message, history);
      console.error('[chat] LLM raw:', raw ? raw.substring(0, 200) : 'EMPTY/UNDEFINED');
      // 尝试提取 JSON（LLM 可能包在 ```json ``` 里）
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('[chat] LLM 调用/解析失败', e.message);
    }

    // 安全兜底
    const result = {
      quickReply: parsed?.quickReply?.slice(0, 20) || '我在呢～',
      megachar: {
        chars:            Array.isArray(parsed?.megachar?.chars) ? parsed.megachar.chars.slice(0, 4) : ['好'],
        direction:        parsed?.megachar?.direction === 'horizontal' ? 'horizontal' : 'vertical',
        rotateInterval:   Number(parsed?.megachar?.rotateInterval) || 0,
        duration:         Math.min(Number(parsed?.megachar?.duration) || 3000, 5000),
      },
      stream: Array.isArray(parsed?.stream) ? parsed.stream.slice(0, 5).map(s => ({
        text:  (s.text || '...').slice(0, 30),
        emoji: safeEmoji(s.emoji),
        ...(s.word ? { word: s.word.slice(0, 4) } : {}),
      })) : [
        { text: '我在听你说呢～', emoji: '^_^' },
        { text: '继续说吧，我都在', emoji: '(^_^)/' },
      ],
    };

    return ok(res, result);
  } catch (err) {
    console.error('[chat]', err.message);
    return ok(res, {
      quickReply: '嗯？我好像走神了～',
      megachar:  { chars: ['诶'], direction: 'vertical', rotateInterval: 0, duration: 3000 },
      stream:     [{ text: '网络好像有点问题，稍等一下哦', emoji: '-_-' }],
    });
  }
});

// ─── 4. POST /ziling/api/validate ── 游戏态·组词判定 ────────
/**
 * 请求体：{ char1, char2 }
 * 响应体：{ valid: true/false, word?: "词语" }
 */
const COMMON_WORDS = new Set([
  '明天','开心','学习','跑步','完成','坚持','努力','健康','快乐','休息',
  '朋友','家人','时间','计划','目标','进步','成长','习惯','打卡','积分',
  '宠物','字灵','互动','游戏','挑战','成功','失败','继续','开始','结束',
]);

router.post('/validate', async (req, res) => {
  try {
    const { char1, char2 } = req.body;
    if (!char1 || !char2) return ok(res, { valid: false });

    const w1 = char1 + char2;
    const w2 = char2 + char1;

    // 1. 本地词库先判定（0延迟）
    if (COMMON_WORDS.has(w1) || COMMON_WORDS.has(w2)) {
      return ok(res, { valid: true, word: COMMON_WORDS.has(w1) ? w1 : w2 });
    }

    // 2. 兜底：LLM 判定（延迟约 1~2s）
    try {
      const sys = `你是一个组词判定工具。用户给出两个字，判断是否能组成一个常见中文词。只回答 YES 或 NO，不要解释。`;
      const raw = await callLLM(sys, `这两个字能组词吗：${char1} ${char2}`, []);
      const valid = /YES/i.test(raw);
      return ok(res, { valid });
    } catch {
      return ok(res, { valid: false });
    }
  } catch {
    return ok(res, { valid: false });
  }
});

module.exports = router;
