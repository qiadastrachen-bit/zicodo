'use strict';

/**
 * 检查执行记录控制器
 */

const { InspectionRun } = require('../models');
const { ok } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

async function createRun(req, res) {
  const {
    title = '系统自检',
    total = 0,
    passed = 0,
    durationMs = null,
    cases = [],
    summary = null,
    operator = null,
  } = req.body;

  const run = await InspectionRun.create({
    title,
    total: Number(total) || 0,
    passed: Number(passed) || 0,
    durationMs: durationMs != null ? Number(durationMs) : null,
    cases,
    summary,
    operator,
    userId: req.user?.id || null,
  });

  return ok(res, run, run.success ? '检查通过，已记录' : '检查完成，存在未通过用例', 201);
}

async function listRuns(req, res) {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const { count, rows } = await InspectionRun.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit, offset,
  });

  return ok(res, { total: count, page, limit, rows });
}

async function getRun(req, res) {
  const run = await InspectionRun.findByPk(req.params.id);
  if (!run) throw new AppError(CODES.RUN_NOT_FOUND);
  return ok(res, run);
}

module.exports = { createRun, listRuns, getRun };
