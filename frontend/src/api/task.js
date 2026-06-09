/**
 * task.js - 任务相关 API
 * 与后端路由严格对齐
 */

import request from './request'

// 获取任务列表
export const getTasks = (params) => {
  return request.get('/tasks', { params })
}

// 获取单个任务详情
export const getTaskById = (taskId) => {
  return request.get(`/tasks/${taskId}`)
}

// 创建任务
export const createTask = (data) => {
  return request.post('/tasks', data)
  // data: { title, description?, category?, pointsReward?, repeatType?, dueDate? }
}

// 更新任务
export const updateTask = (taskId, data) => {
  return request.put(`/tasks/${taskId}`, data)
}

// 删除任务
export const deleteTask = (taskId) => {
  return request.delete(`/tasks/${taskId}`)
}

// 任务打卡
export const checkTask = (taskId) => {
  return request.post(`/tasks/${taskId}/check`)
}
