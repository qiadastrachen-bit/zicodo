'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Team — 团队表
 */
const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: { len: [2, 50] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // 队长的 userId
  leaderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // 邀请码（6位大写字母+数字）
  inviteCode: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
  },
  // 最大成员数
  maxMembers: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  // 团队总积分（用于 PK 排行榜）
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'teams',
  indexes: [{ fields: ['inviteCode'] }],
});

module.exports = Team;
