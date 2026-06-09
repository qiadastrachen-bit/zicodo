'use strict';

/**
 * 003-create-pets.js — 创建 pets 表
 *
 * 对应模型：src/models/Pet.js
 * 执行顺序：第 3 个（依赖 users.id 作为 userId 外键）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('pets', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: '所属用户，一人一宠，唯一',
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '小灵',
        comment: '宠物名称，默认"小灵"',
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: '等级 1-20',
      },
      exp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '当前等级的经验值',
      },
      stage: {
        type: DataTypes.ENUM('egg', 'child', 'teen', 'adult', 'awakened'),
        defaultValue: 'egg',
        comment: '宠物成长阶段',
      },
      mood: {
        type: DataTypes.ENUM('happy', 'neutral', 'sad', 'angry', 'focused'),
        defaultValue: 'neutral',
        comment: '当前情绪',
      },
      colorTone: {
        type: DataTypes.ENUM('vivid', 'normal', 'dim', 'red', 'blue'),
        defaultValue: 'normal',
        comment: '色调（由连续打卡/懈怠决定）',
      },
      personality: {
        type: DataTypes.STRING(200),
        defaultValue: '温柔,好奇',
        comment: '性格标签，逗号分隔',
      },
      lastInteractAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '最后互动时间',
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

    await queryInterface.addIndex('pets', ['userId']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('pets');
  },
};
