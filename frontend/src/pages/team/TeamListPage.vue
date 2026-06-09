<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamsStore } from '@/stores/teams'
import ZlIcon from '@/components/common/ZlIcon.vue'
import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlModal from '@/components/common/ZlModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ZlToast from '@/components/common/ZlToast.vue'
import TeamCard from '@/components/schedule/TeamCard.vue'
import TeamCreateForm from '@/components/schedule/TeamCreateForm.vue'
import JoinTeamForm from '@/components/schedule/JoinTeamForm.vue'

const router = useRouter()
const store = useTeamsStore()

const showCreateForm = ref(false)
const showJoinForm = ref(false)
const actionMenuTeam = ref(null)
const showLeaveConfirm = ref(false)
const teamToLeave = ref(null)
const showHidden = ref(false)

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

function triggerToast(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

onMounted(() => {
  store.fetchTeams().catch(() => {})
})

function openTeam(team) {
  store.openTeam(team)
  router.push(`/teams/${team.id}`)
}

function openActionMenu(team) {
  actionMenuTeam.value = team
}

function onLeaveTeam(team) {
  teamToLeave.value = team
  showLeaveConfirm.value = true
  actionMenuTeam.value = null
}

function onHideTeam(team) {
  store.hideTeam(team.id)
  actionMenuTeam.value = null
  triggerToast('已隐藏团队', 'info')
}

async function doLeaveTeam() {
  const team = teamToLeave.value
  showLeaveConfirm.value = false
  teamToLeave.value = null
  if (!team) return
  try {
    await store.leaveTeam(team.id)
    triggerToast('已退出团队', 'success')
  } catch (e) {
    triggerToast(e.message || '退出失败', 'error')
  }
}

function isLeaderOf(team) {
  if (!team) return false
  return store.isTeamLeader(team.id)
}

function onHiddenVisibleUpdate(val) {
  if (!val) showHidden.value = false
}
</script>

<template>
  <div class="team-list-page">
    <ZlTopBar title="团队" @back="router.back()" />

    <div class="page-content">
      <!-- 标题行：团队列表 + 加入/创建（唯一入口） -->
      <div class="section-header">
        <h3 class="section-title">团队列表</h3>
        <div class="header-actions">
          <button type="button" class="join-team-btn" @click="showJoinForm = true">
            <ZlIcon name="LogIn" :size="18" />
            <span>加入</span>
          </button>
          <button type="button" class="create-team-btn" @click="showCreateForm = true">
            <ZlIcon name="Plus" :size="18" />
            <span>创建</span>
          </button>
        </div>
      </div>

      <div v-if="store.visibleTeams.length" class="team-list">
        <TeamCard
          v-for="team in store.visibleTeams"
          :key="team.id"
          :team="team"
          @click="openTeam(team)"
          @menu="openActionMenu(team)"
        />
      </div>

      <EmptyState
        v-else
        message="您还没有加入团队"
        description="使用右上角按钮创建或加入团队"
      />

      <div
        v-if="store.hiddenCount > 0"
        class="hidden-tip"
        @click="showHidden = true"
      >
        已隐藏 {{ store.hiddenCount }} 个团队 · 查看
      </div>
    </div>

    <ZlModal
      v-if="actionMenuTeam"
      :visible="true"
      :closable="true"
      :show-footer="false"
      :title="actionMenuTeam.name"
      @update:visible="(val) => { if (!val) actionMenuTeam = null }"
    >
      <div class="action-menu">
        <button class="menu-item" @click="onLeaveTeam(actionMenuTeam)">
          <ZlIcon name="LogOut" :size="18" class="menu-icon" />
          <span>退出团队</span>
        </button>
        <button class="menu-item" @click="onHideTeam(actionMenuTeam)">
          <ZlIcon name="EyeOff" :size="18" class="menu-icon" />
          <span>隐藏团队</span>
        </button>
      </div>
    </ZlModal>

    <ZlModal
      v-model:visible="showLeaveConfirm"
      :title="isLeaderOf(teamToLeave) ? '解散团队' : '退出团队'"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="doLeaveTeam"
    >
      <p v-if="isLeaderOf(teamToLeave)" class="confirm-text">
        你是团队组长，退出将<b>同时解散团队</b>，所有成员会被移出团队。确认操作？
      </p>
      <p v-else class="confirm-text">
        退出后需要重新输入邀请码才能加入。确认退出？
      </p>
    </ZlModal>

    <ZlModal
      v-if="showHidden"
      :visible="true"
      title="已隐藏的团队"
      :closable="true"
      :show-footer="false"
      @update:visible="onHiddenVisibleUpdate"
    >
      <div class="action-menu">
        <div
          v-for="id in store.hiddenTeamIds"
          :key="id"
          class="menu-item menu-item--row"
        >
          <span class="team-name-inline">
            {{ store.teams.find((t) => t.id === id)?.name || '未知团队' }}
          </span>
          <button class="restore-btn" @click="store.unhideTeam(id)">
            还原
          </button>
        </div>
        <button
          class="menu-item menu-item--danger"
          @click="store.unhideAllTeams(); showHidden = false"
        >
          <span>全部还原</span>
        </button>
      </div>
    </ZlModal>

    <TeamCreateForm v-if="showCreateForm" @close="showCreateForm = false" @submit="store.fetchTeams()" />
    <JoinTeamForm v-if="showJoinForm" @close="showJoinForm = false" @join="store.fetchTeams()" />

    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />
  </div>
</template>

<style scoped>
.team-list-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.page-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
}

.join-team-btn,
.create-team-btn {
  display: flex;
  align-items: center;
  gap: var(--zl-space-1);
  padding: var(--zl-space-1) var(--zl-space-3);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-sm);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  min-height: 32px;
  transition: opacity var(--zl-transition-fast);
}

.join-team-btn:active,
.create-team-btn:active {
  opacity: 0.85;
}

.join-team-btn {
  background: var(--zl-surface);
  border: 1px solid var(--zl-brand);
  color: var(--zl-brand);
}

.create-team-btn {
  background: var(--zl-brand);
  border: none;
  color: var(--zl-text-inverse, #fff);
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
}

.action-menu {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-xs) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md);
  background: var(--zl-surface);
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  cursor: pointer;
  min-height: 44px;
  text-align: left;
  width: 100%;
}

.menu-item--danger {
  color: var(--zl-danger);
  justify-content: center;
}

.menu-item--row {
  justify-content: space-between;
}

.restore-btn {
  padding: var(--zl-space-xs) var(--zl-space-md);
  background: var(--zl-brand);
  color: #fff;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-sm);
  cursor: pointer;
}

.confirm-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-secondary);
  margin: 0;
}

.hidden-tip {
  text-align: center;
  padding: var(--zl-space-md);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  cursor: pointer;
}
</style>
