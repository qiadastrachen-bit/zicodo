'use strict';

const { PointLog, User } = require('../models');
const { ok, fail }       = require('../utils/helpers');

/**
 * 内部工具函数：发放/扣除积分
 * @param {string} userId
 * @param {number} delta  - 正数=获得，负数=消耗
 * @param {string} source - 来源类型
 * @param {string|null} taskId
 * @param {string} note
 * @param {object|null} transaction - Sequelize 事务
 */
async function awardPoints(userId, delta, source = 'other', taskId = null, note = '', transaction = null) {
  const opts = transaction ? { transaction } : {};

  // SQLite 不支持 RETURNING，用先查后写策略
  const userBefore = await User.findByPk(userId, opts);
  const newBalance = (userBefore.totalPoints || 0) + delta;

  await User.update(
    { totalPoints: newBalance },
    { where: { id: userId }, ...opts }
  );

  const log = await PointLog.create({
    userId,
    delta,
    balanceAfter: newBalance,
    source,
    taskId,
    note,
  }, opts);

  return { balanceAfter: newBalance };
}

/**
 * GET /api/points/logs
 * 查询积分流水，支持分页 ?page=1&limit=20
 */
async function getLogs(req, res) {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await PointLog.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return ok(res, {
    total: count,
    page,
    limit,
    logs: rows,
  });
}

/**
 * GET /api/points/balance
 * 查询当前用户总积分
 */
async function getBalance(req, res) {
  const { User } = require('../models');
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'username', 'totalPoints'],
  });
  return ok(res, { totalPoints: user.totalPoints });
}

/**
 * GET /api/points/leaderboard
 * 个人积分排行榜，取前20名
 */
async function leaderboard(req, res) {
  const { User } = require('../models');
  const top = await User.findAll({
    attributes: ['id', 'username', 'totalPoints'],
    order: [['totalPoints', 'DESC']],
    limit: 20,
  });
  return ok(res, top);
}

module.exports = { awardPoints, getLogs, getBalance, leaderboard };
