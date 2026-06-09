/**
 * team.js - 团队相关 API
 * 团队的增删改查、成员管理、排行榜
 */

import request from './request'

// 获取团队列表（我创建的/我加入的）
export const getTeams = (params) => {
  return request.get('/teams', { params })
  // params: { role? } - 'creator' | 'member'
}

// 获取团队详情
export const getTeamById = (teamId) => {
  return request.get(`/teams/${teamId}`)
}

// 创建团队
export const createTeam = (data) => {
  return request.post('/teams', data)
  // data: { name, description? }
}

// 更新团队信息
export const updateTeam = (teamId, data) => {
  return request.put(`/teams/${teamId}`, data)
}

// 解散团队
export const deleteTeam = (teamId) => {
  return request.delete(`/teams/${teamId}`)
}

// 邀请成员
export const inviteMember = (teamId, data) => {
  return request.post(`/teams/${teamId}/members`, data)
  // data: { user_id }
}

// 移除成员
export const removeMember = (teamId, memberId) => {
  return request.delete(`/teams/${teamId}/members/${memberId}`)
}

// 获取团队任务统计
export const getTeamStats = (teamId) => {
  return request.get(`/teams/${teamId}/stats`)
}

// 获取团队排行榜
export const getTeamRanking = (params) => {
  return request.get('/teams/ranking', { params })
  // params: { period? } - 'week' | 'month' | 'all'
}

// 退出团队（队长退出会同时解散队伍）
export const leaveTeam = () => {
  return request.post('/teams/leave')
}

// TODO: 后端暂未提供以下接口，如需实现需补充
// - 转移管理员：POST /api/teams/:id/transfer
