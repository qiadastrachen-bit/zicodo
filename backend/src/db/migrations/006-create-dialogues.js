'use strict';

/**
 * 006-create-dialogues.js — 创建 dialogues 表
 *
 * 对应模型：src/models/Dialogue.js
 * 执行顺序：第 6 个（依赖 users.id 作为 userId 外键）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('dialogues', {
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '用户发送的消息',
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'AI 宠物的完整回复',
      },
      persona: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '对话时的宠物性格',
      },
      mood: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '对话时的宠物情绪',
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

    await queryInterface.addIndex('dialogues', ['userId']);
    await queryInterface.addIndex('dialogues', ['createdAt']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('dialogues');
  },
};
