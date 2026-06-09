'use strict';

const { PointLog, User } = require('../models');
const { ok }             = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

async function awardPoints(userId, delta, source = 'other', taskId = null, note = '', transaction = null) {
  const opts = transaction ? { transaction } : {};

  const userBefore = await User.findByPk(userId, opts);
  const newBalance = (userBefore.totalPoints || 0) + delta;

  await User.update({ totalPoints: newBalance }, { where: { id: userId }, ...opts });

  const log = await PointLog.create({
    userId, delta, balanceAfter: newBalance,
    source, taskId, note,
  }, opts);

  return { balanceAfter: newBalance };
}

async function getLogs(req, res) {
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await PointLog.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit, offset,
  });

  return ok(res, { total: count, page, limit, logs: rows });
}

async function getBalance(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'username', 'totalPoints'],
  });
  return ok(res, { totalPoints: user.totalPoints });
}

async function leaderboard(req, res) {
  const top = await User.findAll({
    attributes: ['id', 'username', 'totalPoints'],
    order: [['totalPoints', 'DESC']],
    limit: 20,
  });
  return ok(res, top);
}

async function earnPointsHandler(req, res) {
  const { amount, reason, taskId } = req.body;
  const delta = Math.abs(parseInt(amount) || 0);
  if (delta <= 0) throw new AppError(CODES.INVALID_POINT_AMOUNT);

  const result = await awardPoints(req.user.id, delta, 'earn', taskId || null, reason || '奖励');
  return ok(res, { balanceAfter: result.balanceAfter, delta }, '积分获取成功');
}

async function spendPointsHandler(req, res) {
  const { amount, reason } = req.body;
  const delta = Math.abs(parseInt(amount) || 0);
  if (delta <= 0) throw new AppError(CODES.INVALID_POINT_AMOUNT);

  const result = await awardPoints(req.user.id, -delta, 'spend', null, reason || '消费');
  return ok(res, { balanceAfter: result.balanceAfter, delta: -delta }, '积分消费成功');
}

module.exports = { awardPoints, getLogs, getBalance, leaderboard, earnPointsHandler, spendPointsHandler };
