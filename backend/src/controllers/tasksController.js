'use strict';

const { Task, PointLog, Pet, User } = require('../models');
const { ok, fail, isToday }         = require('../utils/helpers');
const { awardPoints }               = require('./pointsController');

/**
 * GET /api/tasks
 * 查询当前用户的任务列表，支持 ?status=active
 */
async function listTasks(req, res) {
  const where = { userId: req.user.id };
  if (req.query.status) where.status = req.query.status;

  const tasks = await Task.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  // 重置 checkedToday：如果 lastCheckedAt 不是今天，则视为未打卡
  const updated = tasks.map(t => {
    const t2 = t.toJSON();
    if (t2.checkedToday && !isToday(t2.lastCheckedAt)) {
      t2.checkedToday = false; // 仅响应层展示，不持久化（启动时批量重置）
    }
    return t2;
  });

  return ok(res, updated);
}

/**
 * POST /api/tasks
 * 创建任务
 * body: { title, description?, category?, pointsReward?, repeatType?, dueDate? }
 */
async function createTask(req, res) {
  const { title, description, category, pointsReward, repeatType, dueDate } = req.body;
  if (!title) return fail(res, '任务标题不能为空');

  const task = await Task.create({
    userId: req.user.id,
    title,
    description,
    category:      category     || 'habit',
    pointsReward:  pointsReward || 10,
    repeatType:    repeatType   || 'none',
    dueDate,
  });

  return ok(res, task, '任务创建成功', 201);
}

/**
 * GET /api/tasks/:id
 * 获取单个任务详情
 */
async function getTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return fail(res, '任务不存在', 404);
  return ok(res, task);
}

/**
 * PUT /api/tasks/:id
 * 更新任务（标题/描述/分类等）
 */
async function updateTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return fail(res, '任务不存在', 404);

  const fields = ['title', 'description', 'category', 'pointsReward', 'repeatType', 'dueDate', 'status'];
  fields.forEach(f => { if (req.body[f] !== undefined) task[f] = req.body[f]; });
  await task.save();

  return ok(res, task, '任务已更新');
}

/**
 * DELETE /api/tasks/:id
 * 删除任务
 */
async function deleteTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return fail(res, '任务不存在', 404);
  await task.destroy();
  return ok(res, null, '任务已删除');
}

/**
 * POST /api/tasks/:id/check
 * 打卡！核心逻辑：
 *   1. 校验今天是否已打卡
 *   2. 计算积分（含连击加成）
 *   3. 写 PointLog，更新 User.totalPoints
 *   4. 更新宠物经验/等级
 *   5. 返回完整结果给前端
 */
async function checkTask(req, res) {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return fail(res, '任务不存在', 404);
  if (task.status !== 'active') return fail(res, '任务已结束，无法打卡');

  // 检查今日是否已打卡
  if (task.checkedToday && isToday(task.lastCheckedAt)) {
    return fail(res, '今日已打卡，明天再来！');
  }

  // ─── 计算连击 ────────────────────────────────────────
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const lastDate = task.lastCheckedAt
    ? new Date(task.lastCheckedAt).toISOString().slice(0, 10)
    : null;

  let newStreak;
  if (lastDate === yesterdayStr) {
    newStreak = task.streakDays + 1;   // 连续打卡
  } else if (!lastDate) {
    newStreak = 1;                      // 首次打卡
  } else {
    newStreak = 1;                      // 断链重置
  }

  // 连击加成：每7天额外+5分，上限+20
  const streakBonus = Math.min(Math.floor(newStreak / 7) * 5, 20);
  const totalDelta = task.pointsReward + streakBonus;

  // ─── 事务：更新任务 + 积分 + 宠物 ─────────────────────
  const { sequelize } = require('../db/connection');
  const result = await sequelize.transaction(async (t) => {
    // 1. 更新任务状态
    task.checkedToday  = true;
    task.lastCheckedAt = new Date();
    task.streakDays    = newStreak;
    if (task.repeatType === 'none') task.status = 'completed';
    await task.save({ transaction: t });

    // 2. 发放积分
    const pointResult = await awardPoints(req.user.id, totalDelta, 'task_check', task.id, `完成任务「${task.title}」`, t);

    // 3. 更新宠物经验
    const pet = await Pet.findOne({ where: { userId: req.user.id }, transaction: t });
    let levelUp = false;
    if (pet) {
      pet.exp += totalDelta;
      pet.lastInteractAt = new Date();

      // 检查升级
      const thresholds = Pet.EXP_THRESHOLDS;
      while (pet.level < 20 && pet.exp >= thresholds[pet.level]) {
        pet.level += 1;
        levelUp = true;
      }
      pet.stage = Pet.getStage(pet.level);

      // 根据连击情况更新色调
      if (newStreak >= 7)       pet.colorTone = 'vivid';
      else if (newStreak >= 3)  pet.colorTone = 'normal';
      else                      pet.colorTone = 'normal';

      pet.mood = 'happy';
      await pet.save({ transaction: t });
    }

    return { task, pointResult, pet, levelUp, streakBonus, totalDelta };
  });

  return ok(res, {
    task: result.task,
    pointsEarned:  result.totalDelta,
    streakBonus:   result.streakBonus,
    streakDays:    newStreak,
    totalPoints:   result.pointResult.balanceAfter,
    pet:           result.pet,
    levelUp:       result.levelUp,
  }, result.levelUp ? `🎉 打卡成功！宠物升级到 Lv${result.pet.level}！` : `✅ 打卡成功！获得 ${result.totalDelta} 积分`);
}

module.exports = { listTasks, createTask, getTask, updateTask, deleteTask, checkTask };
