'use strict';

const { Pet }      = require('../models');
const { ok, fail } = require('../utils/helpers');

/**
 * GET /api/pets/mine
 * 查看自己的宠物
 */
async function getMyPet(req, res) {
  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) return fail(res, '宠物不存在，请联系管理员', 404);
  return ok(res, pet);
}

/**
 * PUT /api/pets/mine/name
 * 重命名宠物
 * body: { name }
 */
async function renamePet(req, res) {
  const { name } = req.body;
  if (!name || name.trim().length < 1) return fail(res, '名字不能为空');

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) return fail(res, '宠物不存在', 404);

  pet.name = name.trim().slice(0, 30);
  await pet.save();
  return ok(res, pet, '宠物重命名成功');
}

/**
 * GET /api/pets/:userId
 * 查看指定用户的宠物（用于社交查看）
 */
async function getPetByUser(req, res) {
  const pet = await Pet.findOne({
    where: { userId: req.params.userId },
    // 社交场景只暴露部分字段
    attributes: ['id', 'userId', 'name', 'level', 'stage', 'mood', 'colorTone', 'personality'],
  });
  if (!pet) return fail(res, '该用户的宠物不存在', 404);
  return ok(res, pet);
}

/**
 * PUT /api/pets/mine/mood
 * 手动触发情绪更新（通常由 AI 对话模块调用，这里留外部接口）
 * body: { mood }
 */
async function updateMood(req, res) {
  const VALID_MOODS = ['happy', 'neutral', 'sad', 'angry', 'focused'];
  const { mood } = req.body;
  if (!VALID_MOODS.includes(mood)) return fail(res, `mood 只能是 ${VALID_MOODS.join('/')}`);

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) return fail(res, '宠物不存在', 404);

  pet.mood = mood;
  pet.lastInteractAt = new Date();
  await pet.save();
  return ok(res, pet, '宠物情绪已更新');
}

module.exports = { getMyPet, renamePet, getPetByUser, updateMood };
