'use strict';

/**
 * 007-create-feedbacks.js — 创建 feedbacks 表
 *
 * 对应模型：src/models/Feedback.js
 * 执行顺序：第 7 个（可选依赖 users.id）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('feedbacks', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: '关联用户（未登录可为空）',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '反馈内容',
      },
      contact: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '联系方式（选填）',
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

    await queryInterface.addIndex('feedbacks', ['userId']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('feedbacks');
  },
};
