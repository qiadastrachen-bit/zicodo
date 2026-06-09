/**
 * user.js - 用户 Store
 * 管理用户信息、登录状态、Token
 */

import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, autoLogin as apiAutoLogin, getCurrentUser } from '@/api/auth'
import { STORAGE_KEYS } from '@/config/constants'

export const useUserStore = defineStore('user', {
  state: () => {
    let user = null
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (storedUser) {
        user = JSON.parse(storedUser)
      }
    } catch (e) {
      console.error('Failed to parse user data from localStorage:', e)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
    return {
      token: localStorage.getItem(STORAGE_KEYS.TOKEN) || '',
      user,
      isLoggedIn: !!localStorage.getItem(STORAGE_KEYS.TOKEN)
    }
  },

  getters: {
    userId: (state) => state.user?.id || null,
    username: (state) => state.user?.username || '',
    nickname: (state) => state.user?.nickname || '',
    displayName: (state) => state.user?.nickname || state.user?.username || '用户',
    userRole: (state) => state.user?.role || 'child',
    isParent: (state) => state.user?.role === 'parent',
    isChild: (state) => state.user?.role === 'child'
  },

  actions: {
    // 登录
    async login(username, password) {
      try {
        // 后端 login API 要求字段名为 email，不是 username
        const data = await apiLogin({ email: username, password })
        this.token = data.token
        this.user = data.user
        this.isLoggedIn = true

        // 持久化
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))

        return data
      } catch (error) {
        throw error
      }
    },

    // 注册
    async register(username, password, nickname) {
      try {
        const data = await apiRegister({ username, password, nickname })
        this.token = data.token
        this.user = data.user
        this.isLoggedIn = true

        // 持久化
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))

        return data
      } catch (error) {
        throw error
      }
    },

    // 自动登录（无感知注册）
    async autoLogin() {
      try {
        const data = await apiAutoLogin()
        this.token = data.token
        this.user = data.user
        this.isLoggedIn = true

        // 持久化
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))

        return data
      } catch (error) {
        throw error
      }
    },

    // 登出
    logout() {
      this.token = ''
      this.user = null
      this.isLoggedIn = false

      // 清除持久化
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    },

    // 更新用户信息
    updateUser(partialUser) {
      this.user = { ...this.user, ...partialUser }
      this.isLoggedIn = true
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
    },

    // 获取当前用户信息
    async fetchCurrentUser() {
      try {
        const user = await getCurrentUser()
        this.user = user
        this.isLoggedIn = true
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        return user
      } catch (error) {
        this.logout()
        throw error
      }
    }
  }
})
