'use strict';

const { Op } = require('sequelize');
const { Team, User, TeamMember } = require('../models');
const { ok, genInviteCode, isValidInviteCode } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

const MEMBER_ATTRS = ['id', 'username', 'nickname', 'totalPoints'];

function memberRole(member, leaderId) {
  const via = member.TeamMember?.role;
  if (via) return via.includes('组长') ? '组长' : via;
  return member.id === leaderId ? '组长' : '成员';
}

/** 将 Sequelize Team 实例格式化为 API 响应 */
function formatTeam(team) {
  const t = team.toJSON ? team.toJSON() : team;
  return {
    ...t,
    members: (t.members || []).map((m) => ({
      id: m.id,
      username: m.username,
      nickname: m.nickname,
      totalPoints: m.totalPoints,
      role: memberRole(m, t.leaderId),
    })),
  };
}

async function loadTeamWithMembers(teamId) {
  return Team.findByPk(teamId, {
    include: [{
      model: User,
      as: 'members',
      attributes: MEMBER_ATTRS,
      through: { attributes: ['role'] },
    }],
  });
}

async function getUserTeamIds(userId) {
  const rows = await TeamMember.findAll({
    where: { userId },
    attributes: ['teamId'],
  });
  return rows.map((r) => r.teamId);
}

async function createTeam(req, res) {
  const { name, description } = req.body;
  if (!name) throw new AppError(CODES.TEAM_NAME_EMPTY);

  let inviteCode;
  let retry = 0;
  do {
    inviteCode = genInviteCode();
    const existing = await Team.findOne({ where: { inviteCode } });
    if (!existing) break;
    retry++;
  } while (retry < 10);

  const team = await Team.create({
    name, description, leaderId: req.user.id, inviteCode,
  });

  await TeamMember.create({
    userId: req.user.id,
    teamId: team.id,
    role: '组长',
  });

  const full = await loadTeamWithMembers(team.id);
  return ok(res, formatTeam(full), '队伍创建成功', 201);
}

async function joinTeam(req, res) {
  const { inviteCode } = req.body;
  if (!inviteCode) throw new AppError(CODES.INVITE_CODE_EMPTY);

  const code = String(inviteCode).trim();
  if (!isValidInviteCode(code)) throw new AppError(CODES.INVALID_INVITE_CODE);

  const team = await Team.findOne({
    where: { inviteCode: code },
    include: [{
      model: User,
      as: 'members',
      attributes: ['id'],
      through: { attributes: [] },
    }],
  });
  if (!team) throw new AppError(CODES.INVALID_INVITE_CODE);
  if (team.members.length >= team.maxMembers) throw new AppError(CODES.TEAM_FULL);

  const already = team.members.some((m) => m.id === req.user.id);
  if (already) throw new AppError(CODES.ALREADY_IN_TEAM);

  await TeamMember.create({
    userId: req.user.id,
    teamId: team.id,
    role: '成员',
  });

  const full = await loadTeamWithMembers(team.id);
  return ok(res, formatTeam(full), '加入队伍成功');
}

async function leaveTeam(req, res) {
  const { teamId } = req.body;
  if (!teamId) throw new AppError(CODES.BAD_REQUEST, '请指定要退出的团队');

  const membership = await TeamMember.findOne({
    where: { userId: req.user.id, teamId },
  });
  if (!membership) throw new AppError(CODES.NOT_IN_TEAM);

  const team = await Team.findByPk(teamId, {
    include: [{ model: User, as: 'members', attributes: ['id'], through: { attributes: [] } }],
  });

  if (!team) {
    await membership.destroy();
    return ok(res, null, '已退出');
  }

  if (team.leaderId === req.user.id) {
    await TeamMember.destroy({ where: { teamId: team.id } });
    await team.destroy();
    return ok(res, null, '队伍已解散');
  }

  await membership.destroy();
  return ok(res, null, '已退出队伍');
}

/** GET /api/teams — 当前用户加入的全部团队 */
async function listMyTeams(req, res) {
  const teamIds = await getUserTeamIds(req.user.id);
  if (!teamIds.length) return ok(res, { list: [] });

  const teams = await Team.findAll({
    where: { id: { [Op.in]: teamIds } },
    include: [{
      model: User,
      as: 'members',
      attributes: MEMBER_ATTRS,
      through: { attributes: ['role'] },
    }],
    order: [['createdAt', 'DESC']],
  });

  return ok(res, { list: teams.map(formatTeam) });
}

async function getMyTeam(req, res) {
  const teamIds = await getUserTeamIds(req.user.id);
  if (!teamIds.length) return ok(res, null);

  const team = await loadTeamWithMembers(teamIds[0]);
  return ok(res, team ? formatTeam(team) : null);
}

async function teamRanking(req, res) {
  const teams = await Team.findAll({
    include: [{ model: User, as: 'members', attributes: ['totalPoints'], through: { attributes: [] } }],
    order: [['totalPoints', 'DESC']],
    limit: 20,
  });

  const ranked = teams.map((team, idx) => {
    const t = team.toJSON();
    t.totalPoints = t.members.reduce((sum, m) => sum + (m.totalPoints || 0), 0);
    t.memberCount = t.members.length;
    delete t.members;
    return { rank: idx + 1, ...t };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return ok(res, ranked);
}

async function getTeam(req, res) {
  const team = await loadTeamWithMembers(req.params.id);
  if (!team) throw new AppError(CODES.TEAM_NOT_FOUND);

  const isMember = team.members.some((m) => m.id === req.user.id);
  if (!isMember) throw new AppError(CODES.FORBIDDEN);

  return ok(res, formatTeam(team));
}

module.exports = {
  createTeam, joinTeam, leaveTeam, listMyTeams, getMyTeam, teamRanking, getTeam,
};
