'use strict';

const bcrypt = require('bcryptjs');
const { User, Pet } = require('../models');
const { ok, petDisplayName } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

function safeUser(user) {
  const { id, username, nickname, email, totalPoints, teamId, createdAt } = user;
  return { id, username, nickname, email, totalPoints, teamId, createdAt };
}

/**
 * GET /api/users/me
 */
async function getProfile(req, res) {
  return ok(res, safeUser(req.user));
}

/**
 * PUT /api/users/me
 * body: { nickname? } — 昵称用于宠物名同步（显示名仍以 username 为准）
 */
async function updateProfile(req, res) {
  const { nickname } = req.body;
  const user = req.user;

  if (nickname !== undefined) {
    const trimmed = String(nickname).trim();
    if (trimmed.length > 50) {
      throw new AppError(CODES.VALIDATION_ERROR, '昵称不能超过 50 个字符');
    }
    user.nickname = trimmed || null;
    await user.save();

    const pet = await Pet.findOne({ where: { userId: user.id } });
    if (pet) {
      pet.name = petDisplayName(user.username, trimmed || null);
      await pet.save();
    }
  }

  return ok(res, safeUser(user), '资料已更新');
}

/**
 * POST /api/users/me/password
 * body: { oldPassword, newPassword }
 */
async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new AppError(CODES.BAD_REQUEST, '请填写原密码和新密码');
  }
  if (newPassword.length < 6) throw new AppError(CODES.WEAK_PASSWORD);

  const user = await User.findByPk(req.user.id);
  if (!user) throw new AppError(CODES.USER_NOT_FOUND);

  const match = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!match) throw new AppError(CODES.INVALID_CREDENTIALS, '原密码错误');

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return ok(res, null, '密码已更新');
}

module.exports = { getProfile, updateProfile, changePassword };
