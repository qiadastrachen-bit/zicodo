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

// 团队 → 成员（User.teamId 外键）
Team.hasMany(User, { foreignKey: 'teamId', as: 'members' });
User.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// 任务 → 积分流水（可选关联）
Task.hasMany(PointLog, { foreignKey: 'taskId' });
PointLog.belongsTo(Task, { foreignKey: 'taskId' });

module.exports = { User, Task, Pet, PointLog, Team };
