'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Feedback — 反馈表
 * 存储用户提交的反馈（支持未登录用户）
 */
const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
}, {
  tableName: 'feedbacks',
  timestamps: true,
  updatedAt: false,
  indexes: [{ fields: ['userId'] }],
});

module.exports = Feedback;
