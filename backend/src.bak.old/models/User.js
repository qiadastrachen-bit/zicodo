'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * User — 用户表
 * 存储注册/登录账号信息
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { len: [2, 50] },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 总积分（冗余字段，方便排行榜查询，由 PointLog 触发更新）
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'users',
  indexes: [{ fields: ['email'] }, { fields: ['username'] }],
});

module.exports = User;
