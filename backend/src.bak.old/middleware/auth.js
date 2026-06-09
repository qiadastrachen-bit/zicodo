'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * JWT 鉴权中间件
 * 验证 Authorization: Bearer <token>，将解码后的 user 挂到 req.user
 */
async function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证 Token' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'username', 'email', 'totalPoints', 'teamId'],
    });
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Token 无效或已过期' });
  }
}

module.exports = { auth };
