'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

/**
 * Pet — 宠物表
 * 每个用户拥有唯一的宠物（1:1 关系）
 */
const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // 每人只有一只宠物
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '小灵',
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: { min: 1, max: 20 },
  },
  // 当前等级的经验值（积分转换，非 totalPoints）
  exp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // 宠物状态：每个等级对应的阶段
  // 1-4: 蛋  5-8: 幼体  9-12: 成长  13-16: 成熟  17-20: 觉醒
  stage: {
    type: DataTypes.ENUM('egg', 'child', 'teen', 'adult', 'awakened'),
    defaultValue: 'egg',
  },
  // 情绪状态（AI对话时体现性格）
  mood: {
    type: DataTypes.ENUM('happy', 'neutral', 'sad', 'angry', 'focused'),
    defaultValue: 'neutral',
  },
  // 色调（由连续打卡/懈怠情况决定）
  colorTone: {
    type: DataTypes.ENUM('vivid', 'normal', 'dim', 'red', 'blue'),
    defaultValue: 'normal',
  },
  // 性格标签（逗号分隔，如 "温柔,好奇,活泼"）
  personality: {
    type: DataTypes.STRING(200),
    defaultValue: '温柔,好奇',
  },
  // 最后互动时间
  lastInteractAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'pets',
  indexes: [{ fields: ['userId'] }],
});

// ─── 等级升级阈值 ──────────────────────────────────────────
// 每个等级所需累计经验（index = level - 1）
Pet.EXP_THRESHOLDS = [
  0,    // Lv1
  50,   // Lv2
  120,  // Lv3
  210,  // Lv4
  320,  // Lv5（进入幼体）
  450,  // Lv6
  600,  // Lv7
  770,  // Lv8
  960,  // Lv9（进入成长）
  1170, // Lv10
  1400, // Lv11
  1650, // Lv12
  1920, // Lv13（进入成熟）
  2210, // Lv14
  2520, // Lv15
  2850, // Lv16
  3200, // Lv17（进入觉醒）
  3570, // Lv18
  3960, // Lv19
  4370, // Lv20 MAX
];

Pet.getStage = (level) => {
  if (level <= 4)  return 'egg';
  if (level <= 8)  return 'child';
  if (level <= 12) return 'teen';
  if (level <= 16) return 'adult';
  return 'awakened';
};

module.exports = Pet;
