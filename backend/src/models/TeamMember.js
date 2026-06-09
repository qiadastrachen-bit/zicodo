'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * TeamMember — 用户与团队多对多关系
 */
const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: '成员',
  },
}, {
  tableName: 'team_members',
  indexes: [
    { unique: true, fields: ['userId', 'teamId'] },
    { fields: ['teamId'] },
  ],
});

module.exports = TeamMember;
