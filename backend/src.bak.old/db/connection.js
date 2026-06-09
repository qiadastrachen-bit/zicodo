'use strict';

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/digital_life.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development'
    ? (msg) => console.log('[SQL]', msg)
    : false,
  define: {
    timestamps: true,        // createdAt / updatedAt 自动维护
    underscored: false,      // 字段名保持 camelCase
  },
});

module.exports = { sequelize };
