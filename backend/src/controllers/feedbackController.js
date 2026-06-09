'use strict';

const { Feedback } = require('../models');
const { ok } = require('../utils/helpers');
const { AppError, CODES } = require('../errors/AppError');

async function createFeedback(req, res) {
  const { content, contact } = req.body;
  if (!content || !content.trim()) {
    throw new AppError(CODES.FEEDBACK_EMPTY);
  }
  const feedback = await Feedback.create({
    userId: req.user?.id || null,
    content: content.trim(),
    contact: contact?.trim() || null,
  });
  return ok(res, feedback, '感谢反馈', 201);
}

async function listMyFeedbacks(req, res) {
  if (!req.user) throw new AppError(CODES.UNAUTHORIZED);
  const feedbacks = await Feedback.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  return ok(res, { list: feedbacks, total: feedbacks.length });
}

module.exports = { createFeedback, listMyFeedbacks };
