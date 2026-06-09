'use strict';

const { Pet }          = require('../models');
const { ok }           = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

async function getMyPet(req, res) {
  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);
  return ok(res, pet);
}

async function renamePet(req, res) {
  const { name } = req.body;
  if (!name || name.trim().length < 1) throw new AppError(CODES.PET_NAME_EMPTY);

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);

  pet.name = name.trim().slice(0, 30);
  await pet.save();
  return ok(res, pet, '宠物重命名成功');
}

async function getPetByUser(req, res) {
  const pet = await Pet.findOne({
    where: { userId: req.params.userId },
    attributes: ['id', 'userId', 'name', 'level', 'stage', 'mood', 'colorTone', 'personality'],
  });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);
  return ok(res, pet);
}

async function updateMood(req, res) {
  const VALID_MOODS = ['happy', 'neutral', 'sad', 'angry', 'focused'];
  const { mood } = req.body;
  if (!VALID_MOODS.includes(mood)) {
    throw new AppError(CODES.INVALID_PET_MOOD, `mood 只能是 ${VALID_MOODS.join('/')}`);
  }

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);

  pet.mood = mood;
  pet.lastInteractAt = new Date();
  await pet.save();
  return ok(res, pet, '宠物情绪已更新');
}

async function updatePetSettings(req, res) {
  const { name, personality, mood } = req.body;
  const VALID_MOODS = ['happy', 'neutral', 'sad', 'angry', 'focused'];

  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);

  if (name && name.trim().length > 0) pet.name = name.trim().slice(0, 30);
  if (personality !== undefined)       pet.personality = personality;
  if (mood && VALID_MOODS.includes(mood)) pet.mood = mood;

  pet.lastInteractAt = new Date();
  await pet.save();
  return ok(res, pet, '保存成功');
}

/**
 * POST /pets/mine/feed
 * 喂养宠物：增加少量经验，更新情绪为 happy
 * 返回：更新后的宠物信息 + 是否升级
 */
async function feedPet(req, res) {
  const pet = await Pet.findOne({ where: { userId: req.user.id } });
  if (!pet) throw new AppError(CODES.PET_NOT_FOUND);

  const EXP_GAIN = 10;
  pet.exp += EXP_GAIN;
  pet.mood = 'happy';
  pet.lastInteractAt = new Date();

  // 检查是否升级
  let levelUp = false;
  const thresholds = Pet.EXP_THRESHOLDS;
  while (pet.level < 20 && pet.exp >= thresholds[pet.level]) {
    pet.level += 1;
    levelUp = true;
  }
  if (levelUp) pet.stage = Pet.getStage(pet.level);

  await pet.save();
  return ok(res, { pet, levelUp, expGain: EXP_GAIN }, levelUp ? '宠物升级啦！' : '已喂养');
}

module.exports = { getMyPet, renamePet, getPetByUser, updateMood, updatePetSettings, feedPet };
