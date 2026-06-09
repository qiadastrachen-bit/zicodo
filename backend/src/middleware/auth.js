'use strict';

/**
 * JWT 鉴权中间件
 *
 * 校验 Authorization: Bearer <token>，解码后挂载 req.user。
 * 鉴权失败统一抛出 AppError，由全局错误中间件输出统一 JSON。
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError, CODES } = require('../errors/AppError');

async function auth(req, _res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(CODES.UNAUTHORIZED, '未提供认证 Token');
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'username', 'email', 'totalPoints', 'teamId'],
    });
    if (!user) throw new AppError(CODES.USER_NOT_FOUND);

    req.user = user;
    next();
  } catch (err) {
    // 如果是我们主动抛出的 AppError，则直接传递；否则翻译为 INVALID_TOKEN
    if (err instanceof AppError) return next(err);
    return next(new AppError(CODES.INVALID_TOKEN, 'Token 无效或已过期'));
  }
}

module.exports = { auth };
