/**
 * schedule.js - 日程任务 Store（V0.0.1：补充前后端对接）
 * 数据流向：页面 → store action → 后端 API → 更新本地状态 → 自动渲染
 * 持久化：localStorage（继续保留，作为缓存 / 离线回退）
 * 字段映射：前端字段（date/note/recurrence/completed）与后端（dueDate/description/repeatType/status+checkedToday）
 *         在 toBackendPayload / fromBackendResponse 中做双向转换
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  isSameDay,
  matchesRecurrence,
  formatLocalDate
} from '@/utils/date'
import * as taskApi from '@/api/task'

const STORAGE_KEY = 'zicodo_schedule_tasks'

// ─── 前端 → 后端字段映射 ──────────────────────────────────────────
function toBackendPayload(task) {
  const repeatType = task.repeatType || (() => {
    if (!task.recurrence) return 'none'
    if (task.recurrence.includes('每天')) return 'daily'
    if (task.recurrence.includes('周')) return 'weekly'
    return 'none'
  })()

  return {
    title: task.title || '',
    description: task.note || task.description || '',
    category: task.category || 'habit',
    pointsReward: task.pointsReward || 10,
    repeatType,
    dueDate: task.date || task.dueDate || null,
  }
}

// ─── 后端 → 前端字段映射 ──────────────────────────────────────────
function fromBackendResponse(backendTask, existingTask = null) {
  const base = existingTask || {
    startTime: null,
    endTime: null,
    location: '',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    type: 'personal',
  }
  return {
    ...base,
    id: backendTask.id,
    title: backendTask.title || base.title,
    date: backendTask.dueDate || base.date,
    note: backendTask.description || base.note,
    recurrence: backendTask.repeatType === 'daily' ? '每天'
              : backendTask.repeatType === 'weekly' ? '每周'
              : base.recurrence,
    completed: backendTask.status === 'completed' || backendTask.checkedToday,
    checkedToday: backendTask.checkedToday,
    pointsReward: backendTask.pointsReward,
    streakDays: backendTask.streakDays,
    category: backendTask.category || base.category,
    status: backendTask.status,
    lastCheckedAt: backendTask.lastCheckedAt,
    createdAt: backendTask.createdAt || base.createdAt || new Date().toISOString(),
    updatedAt: backendTask.updatedAt || new Date().toISOString(),
  }
}

// 默认初始化数据
const DEFAULT_TASKS = [
  {
    id: 'task_1',
    title: '晨起',
    date: '2026-06-08',
    startTime: '07:20',
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: true,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: true,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  },
  {
    id: 'task_2',
    title: '背单词（备战六级）',
    date: '2026-06-08',
    startTime: '18:40',
    endTime: '19:00',
    note: '',
    location: '',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: false,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  },
  {
    id: 'task_3',
    title: '午休',
    date: '2026-06-08',
    startTime: '12:00',
    endTime: '12:40',
    note: '',
    location: '',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: false,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  },
  {
    id: 'task_4',
    title: '跑步锻炼',
    date: '2026-06-08',
    startTime: '19:30',
    endTime: '20:30',
    note: '记得带水杯',
    location: '操场',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: false,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  },
  {
    id: 'task_5',
    title: '去洗衣房',
    date: '2026-06-10',
    recurrence: '每周周三',
    startTime: null,
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: false,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  },
  {
    id: 'task_6',
    title: '倒垃圾',
    date: '2026-06-11',
    recurrence: '每周三，周五',
    startTime: null,
    endTime: null,
    note: '',
    location: '',
    alarmEnabled: false,
    ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
    vibrate: true,
    repeatAlarm: true,
    deleteAfterRing: false,
    completed: false,
    type: 'personal',
    createdAt: '2026-06-08T00:00:00Z',
    updatedAt: '2026-06-08T00:00:00Z'
  }
]

// 从 localStorage 读取（含 V0.0.0 → V0.1.0 数据迁移）
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return DEFAULT_TASKS
    const parsed = JSON.parse(data)
    // 迁移：补充新增的闹钟字段（ringtoneFile/vibrate/repeatAlarm/deleteAfterRing）
    const migrated = parsed.map(task => ({
      ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
      vibrate: true,
      repeatAlarm: true,
      deleteAfterRing: false,
      ...task
    }))
    return migrated
  } catch {
    return DEFAULT_TASKS
  }
}

// 保存到 localStorage
function saveToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useScheduleStore = defineStore('schedule', () => {
  // State
  const tasks = ref(loadFromStorage())
  const currentView = ref('personal') // 'personal' | 'team'
  const showForm = ref(false)
  const editingTask = ref(null)
  const showTimer = ref(false)
  const timerTask = ref(null)

  // 日历相关 State
  const currentCalendarMonth = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth() // 0-indexed
  })
  const selectedDate = ref(formatLocalDate(new Date()))

  // Getters
  const todayTasks = computed(() => {
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      const taskDate = new Date(task.date)
      if (isSameDay(taskDate, today)) return true
      if (matchesRecurrence(task.recurrence, today)) return true
      return false
    })
  })

  // 日历用：根据 currentCalendarMonth 过滤该月任务（排除今天）
  const monthTasks = computed(() => {
    const { year, month } = currentCalendarMonth.value
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      if (!task.date) return false
      const taskDate = new Date(task.date)
      const isInMonth = taskDate.getFullYear() === year && taskDate.getMonth() === month
      const isNotToday = !isSameDay(taskDate, today)
      return isInMonth && isNotToday
    })
  })

  // 其他任务（不在当前月或没有日期）
  const otherTasks = computed(() => {
    const { year, month } = currentCalendarMonth.value
    const today = new Date()
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      if (!task.date) return true // 没有日期的任务
      const taskDate = new Date(task.date)
      const isNotToday = !isSameDay(taskDate, today)
      const isNotInMonth = taskDate.getFullYear() !== year || taskDate.getMonth() !== month
      return isNotToday && isNotInMonth
    })
  })

  // 日历用：选中日期的任务列表（包含重复任务）
  const tasksForSelectedDate = computed(() => {
    const dateStr = selectedDate.value
    return tasks.value.filter(task => {
      if (task.type !== 'personal') return false
      if (task.date === dateStr) return true
      if (task.recurrence) {
        const d = new Date(dateStr)
        return matchesRecurrence(task.recurrence, d)
      }
      return false
    })
  })

  // 日历相关 Actions
  function goToPrevMonth() {
    const { year, month } = currentCalendarMonth.value
    if (month === 0) {
      currentCalendarMonth.value = { year: year - 1, month: 11 }
    } else {
      currentCalendarMonth.value = { year, month: month - 1 }
    }
  }

  function goToNextMonth() {
    const { year, month } = currentCalendarMonth.value
    if (month === 11) {
      currentCalendarMonth.value = { year: year + 1, month: 0 }
    } else {
      currentCalendarMonth.value = { year, month: month + 1 }
    }
  }

  function goToToday() {
    const now = new Date()
    currentCalendarMonth.value = {
      year: now.getFullYear(),
      month: now.getMonth()
    }
    selectedDate.value = formatLocalDate(now)
  }

  function selectDate(dateStr) {
    selectedDate.value = dateStr
  }

  // ─── 从后端同步任务 ───────────────────────────────────────
  async function fetchTasksFromBackend() {
    try {
      const backendTasks = await taskApi.getTasks()
      if (Array.isArray(backendTasks) && backendTasks.length > 0) {
        const merged = backendTasks.map(bt => {
          const existing = tasks.value.find(t => t.id === bt.id)
          return fromBackendResponse(bt, existing)
        })
        // 合并：后端数据优先，保留已有任务中的闹钟等本地字段
        const localOnly = tasks.value.filter(t => !backendTasks.find(bt => bt.id === t.id))
        tasks.value = [...merged, ...localOnly]
        saveToStorage(tasks.value)
        return merged
      }
      return []
    } catch (e) {
      // 后端不可达时静默使用本地数据，不阻塞页面
      console.debug('[schedule] fetchTasksFromBackend failed:', e?.message)
      return []
    }
  }

  // ─── Actions（先调后端 API，成功后更新本地状态） ─────
  async function addTask(taskData) {
    // 先构造前端对象
    const localTask = {
      id: 'task_' + Date.now(),
      ringtoneFile: 'facetalk_ringtone_incoming_default.mp3',
      vibrate: true,
      repeatAlarm: true,
      deleteAfterRing: false,
      ...taskData,
      type: 'personal',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 尝试调后端创建
    try {
      const payload = toBackendPayload(localTask)
      const created = await taskApi.createTask(payload)
      // 用后端返回的 id 和字段更新
      const merged = fromBackendResponse(created, localTask)
      tasks.value.unshift(merged)
      saveToStorage(tasks.value)
      return merged
    } catch (e) {
      console.debug('[schedule] addTask backend failed, falling back to local:', e?.message)
      tasks.value.unshift(localTask)
      saveToStorage(tasks.value)
      return localTask
    }
  }

  async function updateTask(taskId, updates) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index === -1) return

    const before = tasks.value[index]
    const after = { ...before, ...updates, updatedAt: new Date().toISOString() }
    tasks.value[index] = after
    saveToStorage(tasks.value)

    // 尝试同步到后端
    try {
      const payload = toBackendPayload(after)
      await taskApi.updateTask(taskId, payload)
    } catch (e) {
      console.debug('[schedule] updateTask backend failed, local-only update:', e?.message)
    }
  }

  async function deleteTask(taskId) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    saveToStorage(tasks.value)

    try {
      await taskApi.deleteTask(taskId)
    } catch (e) {
      console.debug('[schedule] deleteTask backend failed, local-only delete:', e?.message)
    }
  }

  // 打卡：调后端 POST /tasks/:id/check（触发积分奖励 + 宠物升级）
  async function toggleComplete(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return null

    try {
      const result = await taskApi.checkTask(taskId)
      // 后端返回：{ task, pointsEarned, streakBonus, streakDays, totalPoints, pet, levelUp }
      if (result?.task) {
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) {
          tasks.value[index] = fromBackendResponse(result.task, tasks.value[index])
        }
      }
      task.updatedAt = new Date().toISOString()
      saveToStorage(tasks.value)
      return result // { pointsEarned, levelUp, pet } 供上层显示反馈
    } catch (e) {
      console.debug('[schedule] toggleComplete backend failed, local fallback:', e?.message)
      // 后端不可达时：本地切换状态
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
      saveToStorage(tasks.value)
      return null
    }
  }

  function openForm(task = null) {
    editingTask.value = task
    showForm.value = true
  }

  function closeForm() {
    showForm.value = false
    editingTask.value = null
  }

  function openTimer(task) {
    timerTask.value = task
    showTimer.value = true
  }

  function closeTimer() {
    showTimer.value = false
    timerTask.value = null
  }

  return {
    tasks,
    currentView,
    showForm,
    editingTask,
    showTimer,
    timerTask,
    // 日历相关
    currentCalendarMonth,
    selectedDate,
    todayTasks,
    monthTasks,
    otherTasks,
    tasksForSelectedDate,
    // 日历方法
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    // 任务 CRUD
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    fetchTasksFromBackend,
    openForm,
    closeForm,
    openTimer,
    closeTimer
  }
})
