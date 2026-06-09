'use strict';

/**
 * 认证控制器
 *
 * 错误处理：所有业务异常统一抛 AppError，由全局 error handler 输出 JSON。
 * 注意：register / login / autoLogin / me
 */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User, Pet } = require('../models');
const { ok, petDisplayName } = require('../utils/helpers');
const { AppError, CODES }    = require('../errors/AppError');

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  const { id, username, nickname, email, totalPoints, teamId, createdAt } = user;
  return { id, username, nickname, email, totalPoints, teamId, createdAt };
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  const { username, password, nickname } = req.body;

  if (!username || !password) throw new AppError(CODES.BAD_REQUEST, '用户名和密码不能为空');
  if (password.length < 6) throw new AppError(CODES.WEAK_PASSWORD);

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) throw new AppError(CODES.USERNAME_EXISTS);

  const passwordHash = await bcrypt.hash(password, 10);
  const trimmedNick = nickname && String(nickname).trim() ? String(nickname).trim() : null;
  const user = await User.create({
    username, passwordHash, nickname: trimmedNick });

  await Pet.create({ userId: user.id, name: petDisplayName(username, trimmedNick) });

  return ok(res, { token: signToken(user), user: safeUser(user) }, '注册成功', 201);
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, username, password } = req.body;
  const loginName = email || username;
  if (!loginName || !password) throw new AppError(CODES.BAD_REQUEST, '用户名和密码不能为空');

  let user = await User.findOne({ where: { username: loginName } });
  if (!user) user = await User.findOne({ where: { email: loginName } });
  if (!user) throw new AppError(CODES.INVALID_CREDENTIALS);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AppError(CODES.INVALID_CREDENTIALS);

  return ok(res, { token: signToken(user), user: safeUser(user) }, '登录成功');
}

/**
 * POST /api/auth/auto-login
 * 无感知注册并登录（老用户直接进入）
 */
async function autoLogin(req, res) {
  const randomStr   = Math.random().toString(36).slice(2, 8);
  const timestamp   = Date.now().toString(36).slice(-4);
  const username    = `灵伴_${randomStr}${timestamp}`;
  const randomPwd   = Math.random().toString(36).slice(2, 12) + 'Aa1!';
  try {
    const passwordHash = await bcrypt.hash(randomPwd, 10);
    const user = await User.create({ username, passwordHash, nickname: null });
    await Pet.create({ userId: user.id, name: petDisplayName(username, null) });
    return ok(res, { token: signToken(user), user: safeUser(user) }, '自动登录成功', 201);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      // 用户名冲突：重试一次
      const newRandomStr = Math.random().toString(36).slice(2, 10);
      const newUsername = `灵伴_${newRandomStr}_${Date.now().toString(36)}`;
      const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(2, 12) + 'Aa1!', 10);
      const user = await User.create({ username: newUsername, passwordHash, nickname: null });
      await Pet.create({ userId: user.id, name: petDisplayName(newUsername, null) });
      return ok(res, { token: signToken(user), user: safeUser(user) }, '自动登录成功', 201);
    }
    throw new AppError(CODES.INTERNAL_ERROR, '创建账户失败，请稍后重试');
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  return ok(res, safeUser(req.user));
}

module.exports = { register, login, autoLogin, me };
