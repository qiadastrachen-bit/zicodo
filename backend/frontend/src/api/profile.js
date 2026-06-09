/**
 * profile.js - 个人中心接口
 * ⚠️ 以下接口后端尚未实现，暂用 Mock 数据
 * TODO: 待后端实现真实接口后，替换 Mock 为真实请求
 */

import request from './request'

// Mock 数据：用户信息
const mockUserProfile = {
  id: 1,
  username: 'chenjintong',
  email: 'chenjintong@bupt.edu.cn',
  avatar: '/logo/logo_clear.png',
  nickname: '陈锦彤',
  bio: '智能交互设计 2028届 | zicodo创作者',
  university: '北京邮电大学',
  major: '智能交互设计',
  enrollmentYear: 2024,
  points: 1250,
  level: 5,
  petName: 'zicodo',
  createdAt: '2024-09-01T00:00:00.000Z'
}

// Mock 数据：成就列表
const mockAchievements = [
  { id: 1, title: '初出茅庐', description: '完成第一个任务', icon: '🌟', unlockedAt: '2024-09-10' },
  { id: 2, title: '持之以恒', description: '连续打卡7天', icon: '🔥', unlockedAt: '2024-09-20' },
  { id: 3, title: '汉字达人', description: '在游戏中组词100次', icon: '📚', unlockedAt: null },
  { id: 4, title: '社交蝴蝶', description: '加入3个团队', icon: '🦋', unlockedAt: null }
]

// Mock 数据：对话历史
const mockDialogues = [
  { id: 1, message: '你好，zicodo！', reply: '你好！我是你的数字汉字精灵 ✨', createdAt: '2024-09-10T08:30:00.000Z' },
  { id: 2, message: '今天天气怎么样？', reply: '今天天气晴朗，适合出去走走哦~', createdAt: '2024-09-10T09:15:00.000Z' }
]

/**
 * 获取个人信息
 * TODO: 后端实现 GET /api/users/me 后，替换 Mock
 */
export function getProfile() {
  // Mock 数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ...mockUserProfile })
    }, 300)
  })
  
  // 真实接口（待后端实现）
  // return request.get('/api/users/me')
}

/**
 * 更新个人信息
 * TODO: 后端实现 PUT /api/users/me 后，替换 Mock
 */
export function updateProfile(data) {
  // Mock 数据
  return new Promise(resolve => {
    setTimeout(() => {
      Object.assign(mockUserProfile, data)
      resolve({ ...mockUserProfile })
    }, 300)
  })
  
  // 真实接口（待后端实现）
  // return request.put('/api/users/me', data)
}

/**
 * 获取成就列表
 * TODO: 后端实现 GET /api/achievements 后，替换 Mock
 */
export function getAchievements() {
  // Mock 数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockAchievements])
    }, 300)
  })
  
  // 真实接口（待后端实现）
  // return request.get('/api/achievements')
}

/**
 * 获取对话历史
 * GET /api/ai/dialogues
 */
export function getDialogueHistory(params) {
  return request.get('/ai/dialogues', { params })
}

export default {
  getProfile,
  updateProfile,
  getAchievements,
  getDialogueHistory
}
