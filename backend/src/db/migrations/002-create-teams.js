'use strict';

/**
 * 002-create-teams.js — 创建 teams 表
 *
 * 对应模型：src/models/Team.js
 * 执行顺序：第 2 个（users 可能引用 teamId，teams 在 users 之后创建不影响引用关系，
 * 因为 SQLite 不强制外键检查，且 teams 表本身不依赖其他表）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '团队名称',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '团队描述',
      },
      leaderId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: '队长的 userId',
      },
      inviteCode: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
        comment: '邀请码（6-8 位大写字母+数字）',
      },
      maxMembers: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        comment: '最大成员数',
      },
      totalPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '团队总积分',
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

    await queryInterface.addIndex('teams', ['inviteCode']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('teams');
  },
};
