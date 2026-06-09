/**
 * constants.js - 常量定义
 * 应用全局常量、枚举值
 */

// 用户角色
export const USER_ROLES = {
  CHILD: 'child',
  PARENT: 'parent'
}

// 任务状态
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VERIFIED: 'verified',
  OVERDUE: 'overdue'
}

// 任务类型
export const TASK_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CHALLENGE: 'challenge'
}

// 宠物类型
export const PET_TYPES = {
  ZILING: 'ziling',
  CUSTOM: 'custom'
}

// 积分操作类型
export const POINT_ACTIONS = {
  EARN: 'earn',
  SPEND: 'spend',
  REWARD: 'reward'
}

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'zl_token',
  USER: 'zl_user',
  THEME: 'zl_theme',
  PET: 'zl_pet'
}

// 默认分页
export const DEFAULT_PAGE_SIZE = 20
