'use strict';

/**
 * 业务错误码映射表
 * 规则：
 *   - 1xxx : 认证 / 权限
 *   - 2xxx : 用户 / 宠物
 *   - 3xxx : 任务
 *   - 4xxx : 积分
 *   - 5xxx : 团队
 *   - 6xxx : AI / 数字生命
 *   - 9xxx : 通用 / 系统
 *
 * HTTP 状态码用于传输层语义（400 / 401 / 403 / 404 / 409 / 500 ...），
 * 业务 code 用于前端做精细化处理与文案区分。
 */

const CODES = Object.freeze({
  // ── 认证 / 权限 1xxx ──────────────────────
  UNAUTHORIZED:           { code: 1001, status: 401, message: '未授权，请先登录' },
  INVALID_TOKEN:          { code: 1002, status: 401, message: 'Token 无效或已过期' },
  FORBIDDEN:              { code: 1003, status: 403, message: '没有操作权限' },
  USERNAME_EXISTS:        { code: 1101, status: 409, message: '用户名已被占用' },
  INVALID_CREDENTIALS:    { code: 1102, status: 401, message: '用户名或密码错误' },
  WEAK_PASSWORD:          { code: 1103, status: 400, message: '密码至少 6 位' },

  // ── 用户 / 宠物 2xxx ──────────────────────
  USER_NOT_FOUND:         { code: 2001, status: 404, message: '用户不存在' },
  PET_NOT_FOUND:          { code: 2002, status: 404, message: '宠物不存在' },
  INVALID_PET_MOOD:       { code: 2003, status: 400, message: '宠物情绪参数无效' },
  PET_NAME_EMPTY:         { code: 2004, status: 400, message: '名字不能为空' },

  // ── 任务 3xxx ─────────────────────────────
  TASK_NOT_FOUND:         { code: 3001, status: 404, message: '任务不存在' },
  TASK_TITLE_EMPTY:       { code: 3002, status: 400, message: '任务标题不能为空' },
  TASK_ALREADY_CHECKED:   { code: 3003, status: 400, message: '今日已打卡，明天再来！' },
  TASK_NOT_ACTIVE:        { code: 3004, status: 400, message: '任务已结束，无法打卡' },

  // ── 积分 4xxx ─────────────────────────────
  INVALID_POINT_AMOUNT:   { code: 4001, status: 400, message: '积分数量必须大于0' },

  // ── 团队 5xxx ─────────────────────────────
  TEAM_NOT_FOUND:         { code: 5001, status: 404, message: '队伍不存在' },
  TEAM_NAME_EMPTY:        { code: 5002, status: 400, message: '队伍名称不能为空' },
  TEAM_FULL:              { code: 5003, status: 400, message: '队伍已满' },
  ALREADY_IN_TEAM:        { code: 5004, status: 400, message: '您已是该团队成员' },
  NOT_IN_TEAM:            { code: 5005, status: 400, message: '你不在任何队伍中' },
  INVALID_INVITE_CODE:    { code: 5006, status: 400, message: '邀请码无效' },
  INVITE_CODE_EMPTY:      { code: 5007, status: 400, message: '邀请码不能为空' },

  // ── AI 6xxx ───────────────────────────────
  MESSAGE_EMPTY:          { code: 6001, status: 400, message: '消息不能为空' },
  MEMORY_EMPTY:           { code: 6002, status: 400, message: '记忆内容不能为空' },

  // ── 反馈 7xxx ─────────────────────────────────────
  FEEDBACK_EMPTY:         { code: 7001, status: 400, message: '反馈内容不能为空' },

  // ── 检查 / 执行记录 8xxx ────────────────────────────
  RUN_NOT_FOUND:          { code: 8001, status: 404, message: '执行记录不存在' },

  // ── 通用 9xxx ─────────────────────────────
  BAD_REQUEST:            { code: 9001, status: 400, message: '请求参数错误' },
  VALIDATION_ERROR:       { code: 9002, status: 400, message: '参数校验失败' },
  INTERNAL_ERROR:         { code: 9999, status: 500, message: '服务器内部错误' },
});

module.exports = { CODES };
