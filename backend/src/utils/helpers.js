'use strict';

/**
 * 统一响应格式工具
 */
const ok = (res, data, message = 'success', status = 200) =>
  res.status(status).json({ code: 0, message, data });

/**
 * @deprecated 2026-06 请使用 `throw new AppError(CODES.XXX)` 替代，
 *             由 `middleware/error.js` 的全局错误中间件输出统一 JSON。
 */
const fail = (res, message = '操作失败', status = 400, code) =>
  res.status(status).json({ code: code || status, message, data: null });

/**
 * 生成 6 位纯数字邀请码（100000–999999）
 */
const genInviteCode = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * 校验邀请码格式（6 位数字）
 */
const isValidInviteCode = (code) => typeof code === 'string' && /^\d{6}$/.test(code.trim());

/** 宠物显示名：有昵称用昵称，否则「用户名的宠物」 */
const petDisplayName = (username, nickname) => {
  const n = nickname && String(nickname).trim();
  return n || `${username}的宠物`;
};

/**
 * 获取今日日期字符串 YYYY-MM-DD
 */
const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * 判断某日期是否是今天
 */
const isToday = (date) => {
  if (!date) return false;
  return new Date(date).toISOString().slice(0, 10) === todayStr();
};

module.exports = { ok, fail, genInviteCode, isValidInviteCode, petDisplayName, todayStr, isToday };
