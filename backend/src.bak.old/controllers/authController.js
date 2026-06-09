'use strict';

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User, Pet } = require('../models');
const { ok, fail } = require('../utils/helpers');

/**
 * POST /api/auth/register
 * body: { username, email, password }
 */
async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return fail(res, '用户名、邮箱和密码不能为空');
  }
  if (password.length < 6) {
    return fail(res, '密码至少 6 位');
  }

  // 检查重复
  const exists = await User.findOne({ where: { email } });
  if (exists) return fail(res, '该邮箱已注册');

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) return fail(res, '用户名已被占用');

  // 创建用户
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });

  // 自动为新用户创建宠物
  await Pet.create({ userId: user.id, name: `${username}的宠物` });

  const token = signToken(user);
  return ok(res, { token, user: safeUser(user) }, '注册成功', 201);
}

/**
 * POST /api/auth/login
 * body: { email, password }
 */
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, '昵称和密码不能为空');

  // 支持邮箱或昵称登录：先按 email 查，找不到再按 username 查
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.findOne({ where: { username: email } });
  }

  // ★ 体验服模式：用户不存在 → 自动注册 + 登录
  if (!user) {
    const crypto = require('crypto');
    const autoEmail = `${crypto.randomUUID()}@ziling.local`;

    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      username: email,           // 昵称（前端传来的 email 字段实际是昵称）
      email: autoEmail,          // 自动生成邮箱，用户无感知
      passwordHash
    });

    // 自动创建宠物
    await Pet.create({ userId: user.id, name: `${email}的宠物` });

    // 签发 token，注册后自动登录
    const token = signToken(user);
    return ok(res, { token, user: safeUser(user) }, '注册并登录成功', 201);
  }

  // 用户已存在，验证密码
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return fail(res, '密码错误', 401);

  const token = signToken(user);
  return ok(res, { token, user: safeUser(user) }, '登录成功');
}

/**
 * GET /api/auth/me  (需要鉴权)
 */
async function me(req, res) {
  return ok(res, safeUser(req.user));
}

// ─── 工具 ─────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  const { id, username, totalPoints, teamId, createdAt } = user;
  return { id, username, totalPoints, teamId, createdAt };
}

module.exports = { register, login, me };
