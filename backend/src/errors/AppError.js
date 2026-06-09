'use strict';

/**
 * 自定义应用错误类
 *
 * 用法 1：直接 throw
 *   throw new AppError(CODES.USER_NOT_FOUND);
 *
 * 用法 2：携带额外 message
 *   throw new AppError(CODES.BAD_REQUEST, '自定义消息');
 *
 * 用法 3：从系统错误包装
 *   try { ... } catch (err) {
 *     throw AppError.wrap(err, CODES.INTERNAL_ERROR);
 *   }
 */

const { CODES } = require('./codes');

class AppError extends Error {
  /**
   * @param {Object} definition  CODES 中的一项 { code, status, message }
   * @param {string} [message]   可选，覆盖默认 message
   */
  constructor(definition, message) {
    const def = definition || CODES.INTERNAL_ERROR;
    super(message || def.message);

    this.name = 'AppError';
    this.code = def.code;
    this.status = def.status;
    this.isOperational = true; // 标记为已知可预期错误

    // 保留堆栈
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * 将任意错误包装为 AppError
   * 若已为 AppError 则原样返回，便于上层统一处理
   */
  static wrap(err, definition = CODES.INTERNAL_ERROR) {
    if (err instanceof AppError) return err;
    const wrapped = new AppError(definition, err.message);
    // 保留原始堆栈
    if (err.stack) wrapped.stack = err.stack;
    return wrapped;
  }

  /**
   * 直接从定义创建一个错误实例并 throw
   * 用法：AppError.throw(CODES.USER_NOT_FOUND)
   */
  static throw(definition, message) {
    throw new AppError(definition, message);
  }
}

module.exports = { AppError, CODES };
