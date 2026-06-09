'use strict';

/**
 * 005-create-point-logs.js — 创建 point_logs 表
 *
 * 对应模型：src/models/PointLog.js
 * 执行顺序：第 5 个（依赖 users.id，可选依赖 tasks.id）
 * 注意：PointLog 只有 createdAt，没有 updatedAt（流水只读）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('point_logs', {
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
      delta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '积分变动量（正=获得，负=消耗）',
      },
      balanceAfter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '变动后的用户总积分快照',
      },
      source: {
        type: DataTypes.ENUM('task_check', 'streak_bonus', 'team_pk', 'admin', 'other'),
        defaultValue: 'task_check',
        comment: '积分来源',
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: '关联任务ID（选填）',
      },
      note: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '备注说明',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '流水只有创建时间，不更新',
      },
      // 注意：PointLog 没有 updatedAt（流水只读）
    });

    await queryInterface.addIndex('point_logs', ['userId']);
    await queryInterface.addIndex('point_logs', ['source']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('point_logs');
  },
};
