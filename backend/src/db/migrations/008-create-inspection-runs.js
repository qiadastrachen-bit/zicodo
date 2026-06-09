'use strict';

/**
 * 008-create-inspection-runs.js — 创建 inspection_runs 表
 *
 * 对应模型：src/models/InspectionRun.js
 * 执行顺序：第 8 个（不依赖其他表，userId 为可选）
 * 注意：InspectionRun 有一个 VIRTUAL 字段 success（仅在查询时计算，不存数据库）
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('inspection_runs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '系统自检',
        comment: '检查标题',
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '用例总数',
      },
      passed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '通过数',
      },
      durationMs: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '执行耗时（毫秒）',
      },
      cases: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: '详细用例数组',
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '备注说明',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: '发起检查的用户（选填）',
      },
      operator: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '操作者描述',
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

    // 注意：success 是 VIRTUAL 字段，不建表
    await queryInterface.addIndex('inspection_runs', ['createdAt']);
    await queryInterface.addIndex('inspection_runs', ['userId']);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('inspection_runs');
  },
};
