'use strict';

/**
 * 错误处理中间件集合
 *
 * 1) asyncHandler(fn): 包装 async 路由，自动把未捕获异常转交到 error handler
 * 2) notFoundHandler:    404 兜底
 * 3) errorHandler:       统一的 JSON 错误响应
 * 4) validate:           对 express-validator 结果的统一抛出
 */

const createError = require('http-errors');
const { validationResult } = require('express-validator');

const { AppError, CODES } = require('../errors/AppError');

/**
 * 包装 async 路由，任何 await 抛出的错误都会走到下一个错误中间件
 * 用法：router.get('/xxx', asyncHandler(controller.someAction))
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 对 express-validator 校验结果统一抛出 AppError
 * 用法：await validate(req);
 */
function validate(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    const msg = first.msg || `${first.param || '参数'} 校验失败`;
    throw new AppError(CODES.VALIDATION_ERROR, msg);
  }
}

/**
 * 404 兜底：路由不存在时触发
 */
function notFoundHandler(req, res, next) {
  next(createError(404, `找不到 ${req.method} ${req.originalUrl}`));
}

/**
 * 统一错误响应中间件（四参数形式）
 * 会依次识别：AppError → http-errors HttpError → Sequelize 错误 → 未知错误
 */
function errorHandler(err, req, res, _next) {
  let status = 500;
  let code = CODES.INTERNAL_ERROR.code;
  let message = CODES.INTERNAL_ERROR.message;

  // ── AppError（业务层主动 throw） ─────────────────
  if (err instanceof AppError) {
    status = err.status;
    code = err.code;
    message = err.message;
  }

  // ── http-errors（库返回的 HttpError） ───────────
  else if (err && err.status && typeof err.status === 'number') {
    status = err.status;
    message = err.message || `HTTP ${err.status}`;
    code = status; // 用 HTTP 状态码作为业务 code
  }

  // ── Sequelize 常见错误 ─────────────────────────
  else if (err && err.name) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      status = 409;
      code = 9003;
      message = '数据冲突，存在唯一键重复';
    } else if (err.name === 'SequelizeValidationError') {
      status = 400;
      code = CODES.VALIDATION_ERROR.code;
      message = err.errors && err.errors[0]
        ? err.errors[0].message
        : '数据校验失败';
    } else if (err.name === 'SequelizeDatabaseError') {
      status = 500;
      code = 9004;
      message = '数据库异常';
    }
  }

  // ── 开发环境：把未知错误的 message 透出，便于调试 ──
  const isDev = process.env.NODE_ENV !== 'production';
  if (status === 500 && isDev) {
    message = err && err.message ? err.message : message;
  }

  // 始终记录错误堆栈（生产环境可改为结构化日志）
  const logLine = isDev
    ? err && err.stack
    : `[${status}] ${err && err.message}`;
  console.error('[ERROR]', logLine);

  res.status(status).json({
    code,
    message,
    data: null,
    ...(isDev && status === 500 && err && err.stack
      ? { stack: err.stack.split('\n').slice(0, 5) }
      : {}),
  });
}

module.exports = {
  asyncHandler,
  validate,
  notFoundHandler,
  errorHandler,
};
