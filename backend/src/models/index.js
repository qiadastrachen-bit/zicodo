'use strict';

/**
 * index.js — 模型统一导出 + 关联关系定义
 * 所有模型 require 都从这里走，不要单独 require 各自的文件
 */

const User     = require('./User');
const Task     = require('./Task');
const Pet      = require('./Pet');
const PointLog = require('./PointLog');
const Team     = require('./Team');
const TeamMember = require('./TeamMember');
const Dialogue = require('./Dialogue');
const Feedback = require('./Feedback');
const InspectionRun = require('./InspectionRun');

// ─── 关联关系 ─────────────────────────────────────────────

// 用户 → 任务（一对多）
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// 用户 → 宠物（一对一）
User.hasOne(Pet, { foreignKey: 'userId', onDelete: 'CASCADE' });
Pet.belongsTo(User, { foreignKey: 'userId' });

// 用户 → 积分流水（一对多）
User.hasMany(PointLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
PointLog.belongsTo(User, { foreignKey: 'userId' });

// 团队 ↔ 成员（多对多，team_members 表）
User.belongsToMany(Team, {
  through: TeamMember,
  foreignKey: 'userId',
  otherKey: 'teamId',
  as: 'teams',
});
Team.belongsToMany(User, {
  through: TeamMember,
  foreignKey: 'teamId',
  otherKey: 'userId',
  as: 'members',
});
// 保留 users.teamId 字段兼容旧数据，新业务以 team_members 为准
User.belongsTo(Team, { foreignKey: 'teamId', as: 'primaryTeam' });

// 任务 → 积分流水（可选关联）
Task.hasMany(PointLog, { foreignKey: 'taskId' });
PointLog.belongsTo(Task, { foreignKey: 'taskId' });

// 用户 → 对话历史（一对多）
User.hasMany(Dialogue, { foreignKey: 'userId', onDelete: 'CASCADE' });
Dialogue.belongsTo(User, { foreignKey: 'userId' });

// 用户 → 反馈（一对多）
User.hasMany(Feedback, { foreignKey: 'userId', onDelete: 'SET NULL' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

// 用户 → 检查执行记录（一对多，可选）
User.hasMany(InspectionRun, { foreignKey: 'userId', onDelete: 'SET NULL' });
InspectionRun.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User, Task, Pet, PointLog, Team, TeamMember, Dialogue, Feedback, InspectionRun,
};
