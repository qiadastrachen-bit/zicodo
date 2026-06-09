'use strict';

/**
 * InspectionRun — 系统检查 / smoke-test 执行记录
 *
 * 每次运行自检（或代码修改后的验证）都会写入一条记录，
 * 便于事后追溯：什么时候跑的？跑了哪些用例？总体是否通过？
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const InspectionRun = sequelize.define('InspectionRun', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  // 检查标题（例如 "统一错误处理上线验证"）
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: '系统自检',
  },

  // 用例总数 / 通过数
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  passed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  // 执行耗时（毫秒）
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  // 是否通过 —— 作为快速过滤/仪表盘字段
  success: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.total > 0 && this.passed === this.total;
    },
  },

  // 详细用例：[{name, status, detail}] JSON
  cases: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },

  // 备注 / 说明
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // 可选：启动这次检查的用户
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },

  // 操作者的描述（允许匿名检查）
  operator: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'inspection_runs',
  indexes: [
    { fields: ['createdAt'] },
    { fields: ['userId'] },
  ],
});

module.exports = InspectionRun;
