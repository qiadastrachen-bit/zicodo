'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * PointLog — 积分流水表
 * 每次积分变动记录一条，可完整还原用户积分历史
 */
const PointLog = sequelize.define('PointLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // 积分变动量（正数=获得，负数=消耗）
  delta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 变动后的总积分快照
  balanceAfter: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 来源类型
  source: {
    type: DataTypes.ENUM('task_check', 'streak_bonus', 'team_pk', 'admin', 'other'),
    defaultValue: 'task_check',
  },
  // 关联的任务ID（可选）
  taskId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // 备注说明
  note: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
}, {
  tableName: 'point_logs',
  indexes: [{ fields: ['userId'] }, { fields: ['source'] }],
  updatedAt: false, // 流水只有 createdAt，不需要更新
});

module.exports = PointLog;
