'use strict';

/**
 * RAG 记忆服务
 * ─────────────────────────────────────────────────────────
 * 方案：SQLite + 关键词搜索（轻量版）
 *   - 不依赖向量数据库，零部署成本，适合期中答辩演示
 *   - 生产/期末升级方向：替换为 ChromaDB + embedding
 *
 * 使用方式：
 *   const rag = require('./ragService');
 *   await rag.addMemory(userId, text, tags?);
 *   const relevant = await rag.searchMemory(userId, query, topK?);
 */

const { sequelize } = require('../db/connection');
const { DataTypes, Op } = require('sequelize');

// ─── 记忆表 Model（懒加载，首次调用时建表）─────────────────
let Memory;
function getMemoryModel() {
  if (Memory) return Memory;
  Memory = sequelize.define('PetMemory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 逗号分隔的关键词标签，方便检索
    tags: {
      type: DataTypes.STRING(500),
      defaultValue: '',
    },
    // 记忆的重要程度（1-5，越高越优先召回）
    importance: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
  }, {
    tableName: 'pet_memories',
    indexes: [{ fields: ['userId'] }],
  });

  Memory.sync({ alter: true }).catch(console.error);
  return Memory;
}

/**
 * 存入记忆
 * @param {string} userId
 * @param {string} content   - 记忆文本（对话摘要/关键事件）
 * @param {string[]} tags    - 关键词列表，可选
 * @param {number} importance
 */
async function addMemory(userId, content, tags = [], importance = 3) {
  const M = getMemoryModel();
  return M.create({
    userId,
    content,
    tags: tags.join(','),
    importance,
  });
}

/**
 * 检索相关记忆（关键词匹配，取 topK 条）
 * @param {string} userId
 * @param {string} query    - 用户当前输入
 * @param {number} topK     - 最多返回条数
 * @returns {string[]} 相关记忆文本列表
 */
async function searchMemory(userId, query, topK = 5) {
  const M = getMemoryModel();

  // 简单分词：按空格、逗号、句号拆分
  const keywords = query
    .split(/[\s，。！？,. !?]+/)
    .filter(k => k.length >= 2);

  if (keywords.length === 0) {
    // 没有关键词时，返回最近几条
    const recent = await M.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: topK,
    });
    return recent.map(m => m.content);
  }

  // 按关键词在 content 或 tags 里匹配
  const conditions = keywords.map(kw => ({
    [Op.or]: [
      { content: { [Op.like]: `%${kw}%` } },
      { tags:    { [Op.like]: `%${kw}%` } },
    ],
  }));

  const results = await M.findAll({
    where: {
      userId,
      [Op.and]: [{ [Op.or]: conditions.flat().map(c => c[Op.or]).flat() }],
    },
    order: [
      ['importance', 'DESC'],
      ['createdAt',  'DESC'],
    ],
    limit: topK,
  });

  return results.map(m => m.content);
}

/**
 * 列出用户所有记忆（调试/管理用）
 */
async function listMemories(userId, limit = 20) {
  const M = getMemoryModel();
  return M.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
  });
}

module.exports = { addMemory, searchMemory, listMemories };
