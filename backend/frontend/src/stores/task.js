/**
 * task.js - 任务 Store
 * 管理任务列表、筛选、操作（与后端 API 对齐）
 */

import { defineStore } from 'pinia'
import * as taskApi from '@/api/task'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      type: '',
      page: 1,
      limit: 20
    }
  }),

  getters: {
    // 按状态筛选任务
    pendingTasks: (state) => state.tasks.filter(t => !t.checkedToday),
    completedTasks: (state) => state.tasks.filter(t => t.checkedToday),

    // 任务统计
    taskStats: (state) => ({
      total: state.tasks.length,
      pending: state.tasks.filter(t => !t.checkedToday).length,
      completed: state.tasks.filter(t => t.checkedToday).length
    })
  },

  actions: {
    // 获取任务列表
    async fetchTasks(params = {}) {
      this.loading = true
      this.error = null
      try {
        const filters = { ...this.filters, ...params }
        const data = await taskApi.getTasks(filters)
        // 后端返回 ok(res, tasks) -> data 是 tasks 数组
        this.tasks = Array.isArray(data) ? data : []
        return this.tasks
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取单个任务详情
    async fetchTaskById(taskId) {
      this.loading = true
      try {
        const task = await taskApi.getTaskById(taskId)
        this.currentTask = task
        return task
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 创建任务
    async createTask(data) {
      try {
        const task = await taskApi.createTask(data)
        this.tasks.unshift(task)
        return task
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 更新任务
    async updateTask(taskId, data) {
      try {
        const updated = await taskApi.updateTask(taskId, data)
        const index = this.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          this.tasks[index] = updated
        }
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 删除任务
    async deleteTask(taskId) {
      try {
        await taskApi.deleteTask(taskId)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 任务打卡
    async checkTask(taskId) {
      try {
        const updated = await taskApi.checkTask(taskId)
        const index = this.tasks.findIndex(t => t.id === taskId)
        if (index !== -1) {
          this.tasks[index] = updated
        }
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    // 清除当前任务
    clearCurrentTask() {
      this.currentTask = null
    }
  }
})
