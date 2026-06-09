'use strict';

/**
 * 004-create-tasks.js — 创建 tasks 表
 *
 * 对应模型：src/models/Task.js
 * 执行顺序：第 4 个（依赖 users.id 作为 userId 外键）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('tasks', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: '所属用户',
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '任务标题',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '任务描述',
      },
      category: {
        type: DataTypes.ENUM('habit', 'study', 'fitness', 'other'),
        defaultValue: 'habit',
        comment: '任务分类',
      },
      pointsReward: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        comment: '完成奖励积分',
      },
      repeatType: {
        type: DataTypes.ENUM('none', 'daily', 'weekly'),
        defaultValue: 'none',
        comment: '重复周期',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'paused'),
        defaultValue: 'active',
        comment: '任务状态',
      },
      checkedToday: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '今日是否已打卡',
      },
      streakDays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '连续打卡天数',
      },
      lastCheckedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '最后一次打卡时间',
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: '截止日期',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('tasks', ['userId']);
    await queryInterface.addIndex('tasks', ['status']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('tasks');
  },
};
