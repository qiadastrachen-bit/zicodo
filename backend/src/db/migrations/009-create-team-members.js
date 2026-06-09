'use strict';

const { DataTypes } = require('sequelize');
const { randomUUID } = require('crypto');

module.exports = {
  up: async ({ context: queryInterface, sequelize }) => {
    await queryInterface.createTable('team_members', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        defaultValue: '成员',
        allowNull: false,
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

    await queryInterface.addIndex('team_members', ['userId', 'teamId'], { unique: true });
    await queryInterface.addIndex('team_members', ['teamId']);

    // 从 users.teamId 迁移历史数据
    const [rows] = await sequelize.query(
      'SELECT u.id AS userId, u.teamId, t.leaderId FROM users u INNER JOIN teams t ON t.id = u.teamId WHERE u.teamId IS NOT NULL'
    );
    const now = new Date();
    for (const row of rows) {
      const role = row.leaderId === row.userId ? '组长' : '成员';
      await queryInterface.bulkInsert('team_members', [{
        id: randomUUID(),
        userId: row.userId,
        teamId: row.teamId,
        role,
        createdAt: now,
        updatedAt: now,
      }]);
    }
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('team_members');
  },
};
