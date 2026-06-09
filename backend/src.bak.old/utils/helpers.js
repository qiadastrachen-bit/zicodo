'use strict';

/**
 * 统一响应格式工具
 */
const ok = (res, data, message = 'success', status = 200) =>
  res.status(status).json({ code: 200, message, data });

const fail = (res, message = '操作失败', status = 400, code) =>
  res.status(status).json({ code: code || status, message, data: null });

/**
 * 生成6位邀请码（大写字母+数字）
 */
const genInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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

module.exports = { ok, fail, genInviteCode, todayStr, isToday };
