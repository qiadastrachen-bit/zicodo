/**
 * teams.js - 团队 Store（后端 API + 本地隐藏偏好）
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as teamApi from '@/api/team.js'
import { useUserStore } from './user.js'
import { STORAGE_KEYS } from '@/config/constants'

const TEAMS_HIDDEN_KEY = 'zicodo_teams_hidden'

function loadHiddenIds() {
  try {
    const data = localStorage.getItem(TEAMS_HIDDEN_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveHiddenIds(ids) {
  localStorage.setItem(TEAMS_HIDDEN_KEY, JSON.stringify(ids))
}

/** 将后端团队对象映射为前端组件所需结构 */
export function mapTeamFromApi(team) {
  if (!team) return null
  return {
    id: team.id,
    name: team.name,
    description: team.description || '',
    slogan: team.slogan || '',
    inviteCode: team.inviteCode,
    leaderId: team.leaderId,
    createdBy: team.members?.find((m) => m.id === team.leaderId)?.username || '',
    members: (team.members || []).map((m) => ({
      id: m.id,
      username: m.username,
      nickname: m.nickname,
      name: m.username,
      role: m.role || (m.id === team.leaderId ? '组长' : '成员'),
      totalPoints: m.totalPoints || 0,
    })),
    tasks: team.tasks || [],
    createdAt: team.createdAt,
  }
}

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([])
  const loading = ref(false)
  const error = ref(null)
  const showCreateForm = ref(false)
  const showJoinForm = ref(false)
  const currentTeam = ref(null)
  const currentView = ref('list')
  const hiddenTeamIds = ref(loadHiddenIds())

  const teamCount = computed(() => teams.value.length)
  const visibleTeams = computed(() =>
    teams.value.filter((t) => !hiddenTeamIds.value.includes(t.id))
  )
  const hiddenCount = computed(() => hiddenTeamIds.value.length)

  const currentTeamTasks = computed(() => currentTeam.value?.tasks || [])

  /** 从后端拉取团队列表 */
  async function fetchTeams() {
    loading.value = true
    error.value = null
    try {
      const { list } = await teamApi.getMyTeams()
      teams.value = (list || []).map(mapTeamFromApi).filter(Boolean)
      if (currentTeam.value) {
        const updated = teams.value.find((t) => t.id === currentTeam.value.id)
        currentTeam.value = updated || null
      }
      return teams.value
    } catch (e) {
      error.value = e.message
      teams.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTeam(formData) {
    const created = await teamApi.createTeam({
      name: formData.name,
      description: formData.description || '',
    })
    const mapped = mapTeamFromApi(created)
    if (mapped && !teams.value.some((t) => t.id === mapped.id)) {
      teams.value = [...teams.value, mapped]
    }
    return mapped
  }

  async function joinTeamByInviteCode(code) {
    const joined = await teamApi.joinTeam(String(code).trim())
    const mapped = mapTeamFromApi(joined)
    if (mapped && !teams.value.some((t) => t.id === mapped.id)) {
      teams.value = [...teams.value, mapped]
    }
    return mapped
  }

  async function leaveTeam(teamId) {
    await teamApi.leaveTeam(teamId)
    teams.value = teams.value.filter((t) => t.id !== teamId)
    if (hiddenTeamIds.value.includes(teamId)) {
      hiddenTeamIds.value = hiddenTeamIds.value.filter((id) => id !== teamId)
      saveHiddenIds(hiddenTeamIds.value)
    }
    if (currentTeam.value?.id === teamId) {
      currentTeam.value = null
      currentView.value = 'list'
    }
  }

  function hideTeam(teamId) {
    if (!hiddenTeamIds.value.includes(teamId)) {
      hiddenTeamIds.value.push(teamId)
      saveHiddenIds(hiddenTeamIds.value)
    }
  }

  function unhideTeam(teamId) {
    hiddenTeamIds.value = hiddenTeamIds.value.filter((id) => id !== teamId)
    saveHiddenIds(hiddenTeamIds.value)
  }

  function unhideAllTeams() {
    hiddenTeamIds.value = []
    saveHiddenIds([])
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
    } else {
      prompt('邀请码（长按复制）', code)
    }
  }

  function getUserRoleInTeam(teamId) {
    const userStore = useUserStore()
    const username = userStore.username
    const team = teams.value.find((t) => t.id === teamId)
    if (!team || !username) return null
    const member = team.members.find((m) => m.username === username)
    if (!member) return null
    return member.role.includes('组长') ? '组长' : member.role
  }

  function isTeamLeader(teamId) {
    const userStore = useUserStore()
    const team = teams.value.find((t) => t.id === teamId)
    if (!team || !userStore.userId) return false
    return team.leaderId === userStore.userId
  }

  /** 清除团队缓存（退出登录时调用） */
  function reset() {
    teams.value = []
    currentTeam.value = null
    currentView.value = 'list'
    error.value = null
  }

  return {
    teams,
    loading,
    error,
    currentTeam,
    currentView,
    showCreateForm,
    showJoinForm,
    teamCount,
    visibleTeams,
    hiddenCount,
    hiddenTeamIds,
    currentTeamTasks,
    fetchTeams,
    createTeam,
    joinTeamByInviteCode,
    leaveTeam,
    hideTeam,
    unhideTeam,
    unhideAllTeams,
    openTeam,
    closeTeam,
    openMembers,
    openTasks,
    closeDetail,
    copyInviteCode,
    getUserRoleInTeam,
    isTeamLeader,
    reset,
  }
})
