'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Dialogue — 对话历史表
 * 存储用户与 AI 宠物的每一次完整对话
 */
const Dialogue = sequelize.define('Dialogue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
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
    comment: '对话时的宠物性格（gentle / lively / tsundere / calm）',
  },
  mood: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '对话时的宠物情绪（happy / neutral / sad / angry / focused）',
  },
}, {
  tableName: 'dialogues',
  indexes: [
    { fields: ['userId'] },
    { fields: ['createdAt'] },
  ],
});

module.exports = Dialogue;
