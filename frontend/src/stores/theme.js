/**
 * theme.js - 主题 Store
 * 管理亮色/暗色模式切换
 */

import { defineStore } from 'pinia'
import { themes, defaultTheme } from '@/config/theme'
import { STORAGE_KEYS } from '@/config/constants'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem(STORAGE_KEYS.THEME) || defaultTheme,
    systemPreference: false
  }),

  getters: {
    isDark: (state) => state.currentTheme === 'dark',
    isLight: (state) => state.currentTheme === 'light',
    currentThemeConfig: (state) => themes[state.currentTheme]
  },

  actions: {
    // 初始化主题
    initTheme() {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
      if (savedTheme && themes[savedTheme]) {
        this.currentTheme = savedTheme
      } else {
        // 检测系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.currentTheme = prefersDark ? 'dark' : 'light'
        this.systemPreference = true
      }
      this.applyTheme()
    },

    // 切换主题
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.systemPreference = false
      this.applyTheme()
      this.saveTheme()
    },

    // 设置指定主题
    setTheme(themeName) {
      if (themes[themeName]) {
        this.currentTheme = themeName
        this.systemPreference = false
        this.applyTheme()
        this.saveTheme()
      }
    },

    // 跟随系统
    followSystem() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.currentTheme = prefersDark ? 'dark' : 'light'
      this.systemPreference = true
      this.applyTheme()
      this.saveTheme()
    },

    // 应用主题到 DOM
    applyTheme() {
      const theme = themes[this.currentTheme]
      if (!theme) return

      const root = document.documentElement
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--zl-${key}`, value)
      })

      // 设置 data-theme 属性（用于 CSS 选择）
      root.setAttribute('data-theme', this.currentTheme)
    },

    // 保存主题到本地存储
    saveTheme() {
      localStorage.setItem(STORAGE_KEYS.THEME, this.currentTheme)
    }
  }
})
