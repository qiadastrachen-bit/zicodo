'use strict';

const { Task, PointLog, Pet, User } = require('../models');
const { ok, isToday }              = require('../utils/helpers');
const { awardPoints }               = require('./pointsController');
const { AppError, CODES } = require('../errors/AppError');

async function listTasks(req, res) {
  const where = { userId: req.user.id };
  if (req.query.status) where.status = req.query.status;

  const tasks = await Task.findAll({
    where, order: [['createdAt', 'DESC']],
  });

  const updated = tasks.map(t => {
    const t2 = t.toJSON();
    if (t2.checkedToday && !isToday(t2.lastCheckedAt)) t2.checkedToday = false;
    return t2;
  });

  return ok(res, updated);
}

async function createTask(req, res) {
  const { title, description, category, pointsReward, repeatType, dueDate } = req.body;
  if (!title) throw new AppError(CODES.TASK_TITLE_EMPTY);

  const task = await Task.create({
    userId:        req.user.id,
    title, description,
    category:      category     || 'habit',
    pointsReward:  pointsReward || 10,
    repeatType:    repeatType   || 'none',
    dueDate,
  });

  return ok(res, task, '任务创建成功', 201);
}

async function getTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) throw new AppError(CODES.TASK_NOT_FOUND);
  return ok(res, task);
}

async function updateTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) throw new AppError(CODES.TASK_NOT_FOUND);

  const fields = ['title', 'description', 'category', 'pointsReward', 'repeatType', 'dueDate', 'status'];
  fields.forEach(f => { if (req.body[f] !== undefined) task[f] = req.body[f]; });
  await task.save();

  return ok(res, task, '任务已更新');
}

async function deleteTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) throw new AppError(CODES.TASK_NOT_FOUND);
  await task.destroy();
  return ok(res, null, '任务已删除');
}

async function checkTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) throw new AppError(CODES.TASK_NOT_FOUND);
  if (task.status !== 'active') throw new AppError(CODES.TASK_NOT_ACTIVE);

  if (task.checkedToday && isToday(task.lastCheckedAt)) {
    throw new AppError(CODES.TASK_ALREADY_CHECKED);
  }

  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const lastDate = task.lastCheckedAt
    ? new Date(task.lastCheckedAt).toISOString().slice(0, 10)
    : null;

  let newStreak;
  if (lastDate === yesterdayStr)     newStreak = task.streakDays + 1;
  else if (!lastDate)                newStreak = 1;
  else                               newStreak = 1;

  const streakBonus = Math.min(Math.floor(newStreak / 7) * 5, 20);
  const totalDelta  = task.pointsReward + streakBonus;

  const { sequelize } = require('../db/connection');
  const result = await sequelize.transaction(async (t) => {
    task.checkedToday  = true;
    task.lastCheckedAt = new Date();
    task.streakDays    = newStreak;
    if (task.repeatType === 'none') task.status = 'completed';
    await task.save({ transaction: t });

    const pointResult = await awardPoints(
      req.user.id, totalDelta, 'task_check', task.id,
      `完成任务「${task.title}」`, t
    );

    const pet = await Pet.findOne({ where: { userId: req.user.id }, transaction: t });
    let levelUp = false;
    if (pet) {
      pet.exp += totalDelta;
      pet.lastInteractAt = new Date();
      const thresholds = Pet.EXP_THRESHOLDS;
      while (pet.level < 20 && pet.exp >= thresholds[pet.level]) {
        pet.level += 1; levelUp = true;
      }
      pet.stage = Pet.getStage(pet.level);
      pet.colorTone = newStreak >= 7 ? 'vivid' : 'normal';
      pet.mood = 'happy';
      await pet.save({ transaction: t });
    }

    return { task, pointResult, pet, levelUp, streakBonus, totalDelta };
  });

  return ok(res, {
    task:          result.task,
    pointsEarned:  result.totalDelta,
    streakBonus:   result.streakBonus,
    streakDays:    newStreak,
    totalPoints:   result.pointResult.balanceAfter,
    pet:           result.pet,
    levelUp:       result.levelUp,
  }, result.levelUp
    ? `🎉 打卡成功！宠物升级到 Lv${result.pet.level}！`
    : `✅ 打卡成功！获得 ${result.totalDelta} 积分`);
}

module.exports = { listTasks, createTask, getTask, updateTask, deleteTask, checkTask };
