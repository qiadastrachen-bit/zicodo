/**
 * user.js - 用户相关 API
 * 获取/修改用户信息
 */

import request from './request'

// 获取当前登录用户详情
export const getCurrentUser = () => {
  return request.get('/users/me')
}

// 获取指定用户信息
export const getUserById = (userId) => {
  return request.get(`/users/${userId}`)
}

// TODO: 后端暂未提供修改用户信息接口
// 如需实现个人资料编辑功能，需后端补充 PUT /api/users/me 接口
