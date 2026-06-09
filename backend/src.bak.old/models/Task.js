'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Task — 任务/日程表
 * 每条记录代表用户创建的一个打卡任务
 */
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [1, 100] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    // 任务分类：habit(习惯) / study(学习) / fitness(健身) / other
    type: DataTypes.ENUM('habit', 'study', 'fitness', 'other'),
    defaultValue: 'habit',
  },
  pointsReward: {
    // 完成该任务奖励的积分数
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: { min: 1, max: 100 },
  },
  // 重复周期：none / daily / weekly
  repeatType: {
    type: DataTypes.ENUM('none', 'daily', 'weekly'),
    defaultValue: 'none',
  },
  // 任务状态：active(进行中) / completed(已完成) / paused(暂停)
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active',
  },
  // 今日是否已打卡（每日 0 点重置 daily 任务）
  checkedToday: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // 连续打卡天数
  streakDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // 最后一次打卡时间
  lastCheckedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'tasks',
  indexes: [{ fields: ['userId'] }, { fields: ['status'] }],
});

module.exports = Task;
