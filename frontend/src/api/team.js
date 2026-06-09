/**
 * team.js - 团队相关 API（与后端 /api/teams 对齐）
 */

import request from './request'

/** 获取当前用户加入的全部团队 */
export const getMyTeams = () => request.get('/teams')

/** 获取当前用户团队详情 */
export const getMyTeam = () => request.get('/teams/mine')

/** 获取团队详情 */
export const getTeamById = (teamId) => request.get(`/teams/${teamId}`)

/** 创建团队 */
export const createTeam = (data) => request.post('/teams', data)

/** 通过 6 位数字邀请码加入 */
export const joinTeam = (inviteCode) => request.post('/teams/join', { inviteCode })

/** 退出指定团队（队长退出会解散该团队） */
export const leaveTeam = (teamId) => request.post('/teams/leave', { teamId })

/** 团队排行榜 */
export const getTeamRanking = (params) => request.get('/teams/ranking', { params })
