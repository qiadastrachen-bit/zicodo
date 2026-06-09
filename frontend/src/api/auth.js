/**
 * auth.js - 认证相关 API
 * 注册、登录、登出、刷新 Token
 */

import request from './request'

// 注册
export const register = (data) => {
  return request.post('/auth/register', data)
  // data: { username, password, role?, parent_id? }
}

// 登录
export const login = (data) => {
  return request.post('/auth/login', data)
  // data: { username, password }
  // 返回：{ token, user }
}

// 自动登录（无感知注册）
export const autoLogin = () => {
  return request.post('/auth/auto-login')
  // 返回：{ token, user }
}

// 登出
export const logout = () => {
  return request.post('/auth/logout')
}

// 刷新 Token
export const refreshToken = (refreshToken) => {
  return request.post('/auth/refresh', { refreshToken })
}

// 获取当前用户信息（Token 有效时）
export const getCurrentUser = () => {
  return request.get('/auth/me')
}
