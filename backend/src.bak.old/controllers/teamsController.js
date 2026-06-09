'use strict';

const { Team, User }      = require('../models');
const { ok, fail, genInviteCode } = require('../utils/helpers');

/**
 * POST /api/teams
 * 创建队伍
 * body: { name, description? }
 */
async function createTeam(req, res) {
  const { name, description } = req.body;
  if (!name) return fail(res, '队伍名称不能为空');

  // 已有队伍则不能再建
  if (req.user.teamId) return fail(res, '你已在一个队伍中，请先退出再创建');

  // 生成唯一邀请码
  let inviteCode;
  let retry = 0;
  do {
    inviteCode = genInviteCode();
    const existing = await Team.findOne({ where: { inviteCode } });
    if (!existing) break;
    retry++;
  } while (retry < 10);

  const team = await Team.create({
    name,
    description,
    leaderId:   req.user.id,
    inviteCode,
  });

  // 队长加入队伍
  await User.update({ teamId: team.id }, { where: { id: req.user.id } });

  return ok(res, team, '队伍创建成功', 201);
}

/**
 * POST /api/teams/join
 * 用邀请码加入队伍
 * body: { inviteCode }
 */
async function joinTeam(req, res) {
  const { inviteCode } = req.body;
  if (!inviteCode) return fail(res, '邀请码不能为空');

  if (req.user.teamId) return fail(res, '你已在一个队伍中，请先退出');

  const team = await Team.findOne({
    where: { inviteCode: inviteCode.toUpperCase() },
    include: [{ model: User, as: 'members', attributes: ['id'] }],
  });
  if (!team) return fail(res, '邀请码无效');

  if (team.members.length >= team.maxMembers) {
    return fail(res, '队伍已满');
  }

  await User.update({ teamId: team.id }, { where: { id: req.user.id } });

  return ok(res, { teamId: team.id, teamName: team.name }, '加入队伍成功');
}

/**
 * POST /api/teams/leave
 * 退出队伍（队长退出会解散队伍）
 */
async function leaveTeam(req, res) {
  if (!req.user.teamId) return fail(res, '你不在任何队伍中');

  const team = await Team.findByPk(req.user.teamId, {
    include: [{ model: User, as: 'members', attributes: ['id'] }],
  });
  if (!team) {
    await User.update({ teamId: null }, { where: { id: req.user.id } });
    return ok(res, null, '已退出');
  }

  if (team.leaderId === req.user.id) {
    // 队长退出 → 解散队伍，所有成员 teamId 置空
    await User.update({ teamId: null }, { where: { teamId: team.id } });
    await team.destroy();
    return ok(res, null, '队伍已解散');
  }

  await User.update({ teamId: null }, { where: { id: req.user.id } });
  return ok(res, null, '已退出队伍');
}

/**
 * GET /api/teams/mine
 * 查看自己所在队伍详情 + 成员列表
 */
async function getMyTeam(req, res) {
  if (!req.user.teamId) return fail(res, '你不在任何队伍中', 404);

  const team = await Team.findByPk(req.user.teamId, {
    include: [{
      model: User,
      as: 'members',
      attributes: ['id', 'username', 'totalPoints'],
    }],
  });
  if (!team) return fail(res, '队伍不存在', 404);

  return ok(res, team);
}

/**
 * GET /api/teams/ranking
 * 团队积分 PK 排行榜（前20队）
 */
async function teamRanking(req, res) {
  // 以队伍总积分（member totalPoints 之和）实时计算
  const teams = await Team.findAll({
    include: [{
      model: User,
      as: 'members',
      attributes: ['totalPoints'],
    }],
    order: [['totalPoints', 'DESC']],
    limit: 20,
  });

  // 实时汇总
  const ranked = teams.map((team, idx) => {
    const t = team.toJSON();
    t.totalPoints = t.members.reduce((sum, m) => sum + (m.totalPoints || 0), 0);
    t.memberCount = t.members.length;
    delete t.members; // 排行榜不需要详细成员
    return { rank: idx + 1, ...t };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return ok(res, ranked);
}

/**
 * GET /api/teams/:id
 * 查看指定队伍（公开信息）
 */
async function getTeam(req, res) {
  const team = await Team.findByPk(req.params.id, {
    include: [{
      model: User,
      as: 'members',
      attributes: ['id', 'username', 'totalPoints'],
    }],
  });
  if (!team) return fail(res, '队伍不存在', 404);
  return ok(res, team);
}

module.exports = { createTeam, joinTeam, leaveTeam, getMyTeam, teamRanking, getTeam };
