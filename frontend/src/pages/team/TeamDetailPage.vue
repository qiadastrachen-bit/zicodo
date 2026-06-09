<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeamsStore } from '@/stores/teams'
import { useUserStore } from '@/stores/user'
import ZlTopBar from '@/components/common/ZlTopBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TeamDetail from '@/components/schedule/TeamDetail.vue'
import TeamTaskPage from '@/components/schedule/TeamTaskPage.vue'
import MemberList from '@/components/schedule/MemberList.vue'

const router = useRouter()
const route = useRoute()
const store = useTeamsStore()
const userStore = useUserStore()

const teamId = computed(() => route.params.id)

// 优先使用 store.currentTeam（由 TeamListPage openTeam 设置），否则用路由 id 查找
// 确保即使页面刷新，store.currentTeam 也能被正确初始化
onMounted(async () => {
  try {
    await store.fetchTeams()
  } catch (_) { /* 忽略 */ }
  if (!store.currentTeam || store.currentTeam.id !== teamId.value) {
    const found = store.teams.find((t) => t.id === teamId.value)
    if (found) store.openTeam(found)
  }
})

const currentTeam = computed(() => {
  // 优先用 store.currentTeam
  if (store.currentTeam && store.currentTeam.id === teamId.value) {
    return store.currentTeam
  }
  // 否则从 teams 数组查找
  return store.teams.find(t => t.id === teamId.value)
})

const isLeader = computed(() => {
  if (!currentTeam.value) return false
  return store.isTeamLeader(currentTeam.value.id)
})

function handleBack() {
  if (store.currentView !== 'detail') {
    store.openTeam(currentTeam.value)
  } else {
    router.back()
  }
}

function handleOpenTasks(team) {
  store.openTasks()
}

function handleOpenMembers(team) {
  store.openMembers()
}

function handleCloseTasks() {
  store.openTeam(currentTeam.value)
}

function handleCloseMembers() {
  store.openTeam(currentTeam.value)
}
</script>

<template>
  <div class="team-detail-page">
    <ZlTopBar title="团队详情" @back="handleBack" />
    <div class="page-content">
      <!-- 未找到团队 -->
      <EmptyState v-if="!currentTeam" message="未找到该团队" />

      <!-- 团队详情视图 -->
      <TeamDetail
        v-else-if="store.currentView === 'detail'"
        :team="currentTeam"
        :is-leader="isLeader"
        @open-tasks="handleOpenTasks"
        @open-members="handleOpenMembers"
        @close="router.back()"
      />

      <!-- 团队任务视图（确保 currentTeam 存在才渲染） -->
      <TeamTaskPage
        v-else-if="store.currentView === 'tasks' && currentTeam"
        :team="currentTeam"
        :team-id="currentTeam.id"
        @close="handleCloseTasks"
      />

      <!-- 成员列表视图 -->
      <MemberList
        v-else-if="store.currentView === 'members' && currentTeam"
        :team="currentTeam"
        @close="handleCloseMembers"
      />
    </div>
  </div>
</template>

<style scoped>
.team-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}
.page-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
}
</style>
