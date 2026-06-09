/**
 * point.js - 积分相关 API
 * 与后端路由严格对齐：/points/balance, /points/logs, /points/leaderboard
 */

import request from './request'

// 获取当前用户积分余额
// 后端: GET /api/points/balance
export const getPoints = () => {
  return request.get('/points/balance')
}

// 获取积分明细（带分页）
// 后端: GET /api/points/logs?page=&limit=
export const getPointHistory = (params) => {
  return request.get('/points/logs', { params })
}

// 赚取积分（完成任务奖励）
// 后端: POST /api/points/earn
export const earnPoints = (data) => {
  return request.post('/points/earn', data)
  // data: { amount, reason, taskId? }
}

// 消费积分（兑换奖励）
// 后端: POST /api/points/spend
export const spendPoints = (data) => {
  return request.post('/points/spend', data)
  // data: { amount, reason }
}

// 获取积分排行榜
// 后端: GET /api/points/leaderboard
export const getPointsRanking = () => {
  return request.get('/points/leaderboard')
}
