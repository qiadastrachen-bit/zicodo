/**
 * point.js - 积分 Store
 * 管理积分余额、明细
 */

import { defineStore } from 'pinia'
import { getPoints, getPointHistory, earnPoints, spendPoints } from '@/api/point'

export const usePointStore = defineStore('point', {
  state: () => ({
    balance: 0,
    history: [],
    loading: false,
    error: null
  }),

  getters: {
    // 总赚取
    totalEarned: (state) => {
      return state.history
        .filter(h => h.action === 'earn' || h.action === 'reward')
        .reduce((sum, h) => sum + h.amount, 0)
    },

    // 总消费
    totalSpent: (state) => {
      return state.history
        .filter(h => h.action === 'spend')
        .reduce((sum, h) => sum + h.amount, 0)
    }
  },

  actions: {
    // 获取积分余额
    async fetchPoints() {
      this.loading = true
      this.error = null
      try {
        const data = await getPoints()
        this.balance = data.totalPoints || 0
        return data
      } catch (error) {
        console.debug('[PointStore] fetchPoints:', error.message)
        this.error = null
      } finally {
        this.loading = false
      }
    },

    // 获取积分明细
    async fetchHistory(params = {}) {
      this.loading = true
      try {
        const data = await getPointHistory(params)
        // 后端返回 { total, page, limit, logs: [...] }
        this.history = (data.logs || []).map(log => ({
          id: log.id,
          action: log.delta > 0 ? 'earn' : 'spend',
          amount: Math.abs(log.delta),
          reason: log.source,
          time: log.createdAt
        }))
        return data
      } catch (error) {
        console.debug('[PointStore] fetchHistory:', error.message)
        this.error = null
      } finally {
        this.loading = false
      }
    },

    // 赚取积分
    async earn(amount, reason, taskId = null) {
      try {
        const data = await earnPoints({ amount, reason, taskId })
        this.balance = data.balanceAfter || this.balance + amount
        await this.fetchHistory()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 消费积分
    async spend(amount, reason) {
      try {
        const data = await spendPoints({ amount, reason })
        this.balance = data.balanceAfter || this.balance - amount
        await this.fetchHistory()
        return data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 清除积分数据（登出时）
    clearPoints() {
      this.balance = 0
      this.history = []
    }
  }
})
