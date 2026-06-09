/**
 * user.js - 用户 Store
 */

import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getCurrentUser as apiGetAuthMe } from '@/api/auth'
import { updateProfile as apiUpdateProfile, changePassword as apiChangePassword } from '@/api/user'
import { STORAGE_KEYS } from '@/config/constants'
import { usePetStore } from './pet'
import { useTeamsStore } from './teams'

export const useUserStore = defineStore('user', {
  state: () => {
    let user = null
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (storedUser) user = JSON.parse(storedUser)
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
    return {
      token: localStorage.getItem(STORAGE_KEYS.TOKEN) || '',
      user,
      isLoggedIn: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
    }
  },

  getters: {
    userId: (state) => state.user?.id || null,
    username: (state) => state.user?.username || '',
    nickname: (state) => state.user?.nickname || '',
    /** 全局显示名：统一使用登录用户名 */
    displayName: (state) => state.user?.username || '用户',
    userRole: (state) => state.user?.role || 'child',
    isParent: (state) => state.user?.role === 'parent',
    isChild: (state) => state.user?.role === 'child',
  },

  actions: {
    async login(username, password) {
      const data = await apiLogin({ username, password })
      this._setSession(data.token, data.user)
      return data
    },

    async register(username, password, nickname) {
      const trimmedNick = nickname?.trim() || null
      const data = await apiRegister({ username, password, nickname: trimmedNick })
      this._setSession(data.token, data.user)
      return data
    },

    logout() {
      this.token = ''
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.PET)
      try {
        useTeamsStore().reset()
      } catch (_) { /* pinia 未初始化时忽略 */ }
    },

    _setSession(token, user) {
      this.token = token
      this.user = user
      this.isLoggedIn = true
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    },

    updateUser(partialUser) {
      this.user = { ...this.user, ...partialUser }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
    },

    async fetchCurrentUser() {
      const user = await apiGetAuthMe()
      this.user = user
      this.isLoggedIn = true
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      return user
    },

    async saveProfile({ nickname }) {
      const user = await apiUpdateProfile({ nickname })
      this.user = user
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      try {
        const petStore = usePetStore()
        await petStore.fetchMyPet()
      } catch (_) { /* 宠物未创建时忽略 */ }
      return user
    },

    async savePassword({ oldPassword, newPassword }) {
      return apiChangePassword({ oldPassword, newPassword })
    },
  },
})
