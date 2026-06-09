'use strict';

/**
 * 001-create-users.js — 创建 users 表
 *
 * 对应模型：src/models/User.js
 * 字段映射：100% 一致，不做任何额外变更
 * 执行顺序：第 1 个（所有其他表可能依赖 users 的 id 作为外键）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: '登录用户名，全局唯一',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        comment: '邮箱，可选',
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '用户昵称，未填时默认等于 username',
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'bcrypt 加密后的密码哈希',
      },
      totalPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '用户总积分（由 PointLog 触发更新）',
      },
      teamId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: '所属团队 ID，外键指向 teams.id',
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

    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['email']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users');
  },
};
