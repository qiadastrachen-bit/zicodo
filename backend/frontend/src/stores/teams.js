/**
 * teams.js - 团队管理 Store
 * 使用 localStorage 持久化
 * 与个人任务 Store 独立
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useScheduleStore } from './schedule.js'

const TEAMS_STORAGE_KEY = 'zicodo_teams'
const TEAMS_USER_KEY = 'zicodo_teams_user'  // 记录上次访问的用户名
const TEAMS_HIDDEN_KEY = 'zicodo_teams_hidden' // 记录用户选择"隐藏"的团队 id

// 读取隐藏团队列表（localStorage）
function loadHiddenIds() {
  try {
    const data = localStorage.getItem(TEAMS_HIDDEN_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}
function saveHiddenIds(ids) {
  localStorage.setItem(TEAMS_HIDDEN_KEY, JSON.stringify(ids))
}

// 获取当前用户名（从正确的 localStorage key 读取）
// 兼容 username / name 字段，避免因字段不一致导致用户身份判断失败
function getCurrentUser() {
  try {
    const data = localStorage.getItem('zl_user')
    if (!data) return 'guest'
    const user = JSON.parse(data)
    return user.username || user.name || 'guest'
  } catch {
    return 'guest'
  }
}

// 动态获取默认团队（每次调用都重新计算当前用户名）
function getDefaultTeams() {
  const currentUser = getCurrentUser()
  // 只要不是 guest，都给默认团队示例
  if (currentUser === 'guest') return []
  return [
    {
      id: 'team_demo',
      name: '王之故乡',
      description: '智能开源硬件基础',
      slogan: '分别各自为主，合同天下无双',
      inviteCode: '123456',
      createdBy: currentUser,
      members: [
        { id: 'm1', name: currentUser, role: '组长+后端' },
        { id: 'm2', name: '郭定夺', role: '宠物' },
        { id: 'm3', name: '甘乐乐', role: 'UI' },
        { id: 'm4', name: '孙子儒', role: '硬件' },
        { id: 'm5', name: '杨舒惠', role: '统筹' }
      ],
      tasks: [],
      createdAt: new Date().toISOString()
    }
  ]
}

// 从 localStorage 读取
function loadFromStorage() {
  try {
    const savedUser = localStorage.getItem(TEAMS_USER_KEY)
    const currentUser = getCurrentUser()

    // 用户名变了，清空旧数据，重新走 DEFAULT_TEAMS 逻辑
    if (savedUser && savedUser !== currentUser) {
      localStorage.removeItem(TEAMS_STORAGE_KEY)
      return getDefaultTeams()
    }

    const data = localStorage.getItem(TEAMS_STORAGE_KEY)
    if (!data) return getDefaultTeams()
    const teams = JSON.parse(data)

    // 数据迁移：为没有 createdBy 字段的旧团队补齐 createdBy
    teams.forEach(team => {
      if (!team.createdBy) {
        const leader = team.members?.find(m => m.role?.includes('组长'))
        team.createdBy = leader ? leader.name : (team.members?.[0]?.name || currentUser)
      }
    })

    return teams
  } catch {
    return getDefaultTeams()
  }
}

// 保存到 localStorage
function saveToStorage(teams) {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams))
  // 同时存当前用户名，用于检测用户变化
  localStorage.setItem(TEAMS_USER_KEY, getCurrentUser())
}

export const useTeamsStore = defineStore('teams', () => {
  // State
  const teams = ref(loadFromStorage())
  const showCreateForm = ref(false)
  const showJoinForm = ref(false)
  const currentTeam = ref(null)
  const currentView = ref('list') // 'list' | 'detail' | 'members' | 'tasks'
  const hiddenTeamIds = ref(loadHiddenIds()) // 隐藏团队列表（本地过滤用）

  // Getters
  const teamCount = computed(() => teams.value.length)
  // 过滤后展示给用户的列表（去掉已隐藏的）
  const visibleTeams = computed(() =>
    teams.value.filter(t => !hiddenTeamIds.value.includes(t.id))
  )
  const hiddenCount = computed(() => hiddenTeamIds.value.length)

  const currentTeamTasks = computed(() => {
    if (!currentTeam.value) return []
    return currentTeam.value.tasks || []
  })

  // Actions
  function createTeam(formData) {
    // 生成6位数字邀请码
    const inviteCode = String(Math.floor(100000 + Math.random() * 900000))
    const currentUser = getCurrentUser()

    const newTeam = {
      id: 'team_' + Date.now(),
      ...formData,
      inviteCode: inviteCode,
      createdBy: currentUser,
      members: formData.members || [
        { id: 'm_' + Date.now(), name: currentUser, role: '组长' }
      ],
      tasks: [],
      createdAt: new Date().toISOString()
    }
    teams.value.unshift(newTeam)
    saveToStorage(teams.value)
    return newTeam
  }

  function updateTeam(teamId, updates) {
    const index = teams.value.findIndex(t => t.id === teamId)
    if (index !== -1) {
      teams.value[index] = {
        ...teams.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToStorage(teams.value)
    }
  }

  // 退出团队（先调后端 leaveTeam，再清本地）
  async function leaveTeam(teamId) {
    try {
      const { leaveTeam: apiLeave } = await import('@/api/team.js')
      await apiLeave()
    } catch (e) {
      // 后端暂未对接或接口失败时走本地回退
      console.debug('leaveTeam API fallback', e)
    }
    // 本地同步
    teams.value = teams.value.filter(t => t.id !== teamId)
    // 如果该团队同时在"隐藏"列表里，一并清理，避免累计脏数据
    if (hiddenTeamIds.value.includes(teamId)) {
      hiddenTeamIds.value = hiddenTeamIds.value.filter(id => id !== teamId)
      saveHiddenIds(hiddenTeamIds.value)
    }
    saveToStorage(teams.value)
    // 如果正在查看的就是退出的团队，清掉详情态
    if (currentTeam.value && currentTeam.value.id === teamId) {
      currentTeam.value = null
      currentView.value = 'list'
    }
  }

  function deleteTeam(teamId) {
    teams.value = teams.value.filter(t => t.id !== teamId)
    saveToStorage(teams.value)
  }

  // 隐藏团队（纯本地过滤，不影响后端和其他成员）
  function hideTeam(teamId) {
    if (!hiddenTeamIds.value.includes(teamId)) {
      hiddenTeamIds.value.push(teamId)
      saveHiddenIds(hiddenTeamIds.value)
    }
  }

  // 还原单个隐藏团队
  function unhideTeam(teamId) {
    hiddenTeamIds.value = hiddenTeamIds.value.filter(id => id !== teamId)
    saveHiddenIds(hiddenTeamIds.value)
  }

  // 还原所有隐藏团队
  function unhideAllTeams() {
    hiddenTeamIds.value = []
    saveHiddenIds([])
  }

  function findTeamByInviteCode(code) {
    return teams.value.find(t => t.inviteCode === code)
  }

  function joinTeam(teamId) {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      const currentUser = getCurrentUser()
      const alreadyMember = team.members.find(m => m.name === currentUser)
      if (!alreadyMember) {
        team.members.push({
          id: 'm_' + Date.now(),
          name: currentUser,
          role: '成员'
        })
        saveToStorage(teams.value)
      }
    }
  }

  function addTeamTask(teamId, taskData) {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      const newTask = {
        id: 'team_task_' + Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      }
      team.tasks.push(newTask)
      saveToStorage(teams.value)
      return newTask
    }
  }

  function syncTaskToPersonal(taskData) {
    const scheduleStore = useScheduleStore()
    scheduleStore.addTask({
      ...taskData,
      type: 'personal',
      fromTeam: currentTeam.value?.name || ''
    })
  }

  function openTeam(team) {
    currentTeam.value = team
    currentView.value = 'detail'
  }

  function closeTeam() {
    currentTeam.value = null
    currentView.value = 'list'
  }

  function openMembers() {
    currentView.value = 'members'
  }

  function openTasks() {
    currentView.value = 'tasks'
  }

  function closeDetail() {
    currentView.value = 'list'
    currentTeam.value = null
  }

  function copyInviteCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
      alert('邀请码已复制：' + code)
    } else {
      prompt('邀请码（长按复制）', code)
    }
  }

  // 判断当前用户在指定团队中的角色
  function getUserRoleInTeam(teamId) {
    const team = teams.value.find(t => t.id === teamId)
    if (!team) return null
    const currentUser = getCurrentUser()
    const member = team.members.find(m => m.name === currentUser)
    if (!member) return null
    // 检查角色是否包含"组长"（兼容"组长+后端"这种格式）
    return member.role.includes('组长') ? '组长' : member.role
  }

  // 判断当前用户是否是组长（更健壮的判断：角色包含组长或是创建者）
  function isTeamLeader(teamId) {
    const team = teams.value.find(t => t.id === teamId)
    if (!team) return false
    const currentUser = getCurrentUser()
    // 1. 通过角色判断
    const member = team.members.find(m => m.name === currentUser)
    if (member && member.role.includes('组长')) return true
    // 2. 通过创建者判断（createdBy 字段）
    if (team.createdBy && team.createdBy === currentUser) return true
    // 3. 团队只有一个成员且是当前用户，也视为组长
    if (team.members.length === 1 && team.members[0].name === currentUser) return true
    return false
  }

  // 组长分配任务给指定成员
  function assignTaskToMember(teamId, taskData, memberId) {
    const team = teams.value.find(t => t.id === teamId)
    if (!team) return
    if (!isTeamLeader(teamId)) return  // 权限校验

    const member = team.members.find(m => m.id === memberId)
    const newTask = {
      id: 'team_task_' + Date.now(),
      title: taskData.title || '',
      description: taskData.description || '',
      assigneeId: memberId,
      assigneeName: member ? member.name : '未知',
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData
    }
    team.tasks.push(newTask)
    saveToStorage(teams.value)
    return newTask
  }

  return {
    teams,
    currentTeam,
    currentView,
    showCreateForm,
    showJoinForm,
    teamCount,
    visibleTeams,
    hiddenCount,
    hiddenTeamIds,
    currentTeamTasks,
    createTeam,
    updateTeam,
    deleteTeam,
    leaveTeam,
    hideTeam,
    unhideTeam,
    unhideAllTeams,
    findTeamByInviteCode,
    joinTeam,
    addTeamTask,
    syncTaskToPersonal,
    openTeam,
    closeTeam,
    openMembers,
    openTasks,
    closeDetail,
    copyInviteCode,
    getUserRoleInTeam,
    isTeamLeader,
    assignTaskToMember
  }
})
