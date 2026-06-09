<script setup>
import { ref } from 'vue'
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
import { leaveTeam as apiLeaveTeam } from '@/api/team.js'

const router = useRouter()
const store = useTeamsStore()

// 弹出控制
const showCreateForm = ref(false)
const showJoinForm = ref(false)
const actionMenuTeam = ref(null)       // 当前打开操作菜单的团队
const confirmLeaveTeam = ref(null)     // 当前确认"退出/解散"的团队
const showHidden = ref(false)          // 隐藏团队列表弹窗

// Toast 控制（跟 AboutHelp / SettingsPage 用法一致）
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'info' | 'success' | 'warning' | 'error'
function triggerToast(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

function openTeam(team) {
  store.openTeam(team)
  router.push(`/teams/${team.id}`)
}

function openActionMenu(team) {
  actionMenuTeam.value = team
}

function onLeaveTeam(team) {
  confirmLeaveTeam.value = team
  actionMenuTeam.value = null
}

function onHideTeam(team) {
  store.hideTeam(team.id)
  actionMenuTeam.value = null
  triggerToast('已隐藏团队', 'info')
}

async function doLeaveTeam() {
  const team = confirmLeaveTeam.value
  if (!team) return
  try {
    // 调后端 leaveTeam（后端区分普通成员退出 / 队长解散）
    await apiLeaveTeam()
  } catch (e) {
    // 接口暂未实现或失败时静默继续，本地仍清理
    console.debug('leaveTeam API fallback', e)
  }
  // 本地同步移除
  store.leaveTeam(team.id)
  confirmLeaveTeam.value = null
  triggerToast('已退出团队', 'success')
}

// 是否为该团队的组长（用于确认弹窗文案区分"解散"）
function isLeaderOf(team) {
  if (!team) return false
  return store.isTeamLeader(team.id)
}

// 关闭"隐藏团队列表"弹窗的事件处理
function onHiddenVisibleUpdate(val) {
  if (!val) showHidden.value = false
}
</script>

<template>
  <div class="team-list-page">
    <ZlTopBar title="团队" @back="router.back()" />

    <div class="page-content">
      <!-- 团队列表（使用 visibleTeams，已过滤掉已隐藏的团队） -->
      <div v-if="store.visibleTeams.length" class="team-list">
        <TeamCard
          v-for="team in store.visibleTeams"
          :key="team.id"
          :team="team"
          @click="openTeam(team)"
          @menu="openActionMenu(team)"
        />
      </div>

      <!-- 空状态：没有任何团队 -->
      <EmptyState
        v-else
        message="您还没有加入团队"
        description="创建团队或输入邀请码加入"
      />

      <!-- 隐藏团队提示入口（放在列表/空状态之后，永远可见） -->
      <div
        v-if="store.hiddenCount > 0"
        class="hidden-tip"
        @click="showHidden = true"
      >
        已隐藏 {{ store.hiddenCount }} 个团队 · 查看
      </div>

      <!-- 创建 / 加入按钮（放在列表/空状态之后，永远可见） -->
      <div class="action-buttons">
        <button class="action-btn create-btn" @click="showCreateForm = true">
          <ZlIcon name="Plus" :size="18" />
          <span>创建团队</span>
        </button>
        <button class="action-btn join-btn" @click="showJoinForm = true">
          <ZlIcon name="LogIn" :size="18" />
          <span>加入团队</span>
        </button>
      </div>
    </div>

    <!-- 操作菜单：退出团队 / 隐藏团队 -->
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

    <!-- 二次确认：退出团队 / 解散团队 -->
    <ZlModal
      v-if="confirmLeaveTeam"
      :visible="true"
      :title="isLeaderOf(confirmLeaveTeam) ? '解散团队' : '退出团队'"
      :closable="true"
      confirm-text="确定"
      cancel-text="取消"
      @update:visible="(val) => { if (!val) confirmLeaveTeam = null }"
      @confirm="doLeaveTeam"
    >
      <p v-if="isLeaderOf(confirmLeaveTeam)" class="confirm-text">
        你是团队组长，退出将<b>同时解散团队</b>，所有成员会被移出团队。确认操作？
      </p>
      <p v-else class="confirm-text">
        退出后需要重新输入邀请码才能加入。确认退出？
      </p>
    </ZlModal>

    <!-- 隐藏团队列表：还原入口 -->
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
            {{ (store.teams.find(t => t.id === id))?.name || '未知团队' }}
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

    <!-- 原有的创建 / 加入表单弹窗 -->
    <TeamCreateForm v-if="showCreateForm" @close="showCreateForm = false" />
    <JoinTeamForm v-if="showJoinForm" @close="showJoinForm = false" />

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
  gap: var(--zl-space-lg);
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
}

/* ========== 操作菜单（ellipsis 弹出的选项列表） ========== */
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
  transition: background var(--zl-transition-fast);
  min-height: 44px;
  text-align: left;
  width: 100%;
}

.menu-item:active {
  background: var(--zl-bg-cool);
}

.menu-item--danger {
  color: var(--zl-danger);
  justify-content: center;
}

.menu-item--row {
  justify-content: space-between;
  cursor: default;
}

.menu-icon {
  color: var(--zl-text-secondary);
  flex-shrink: 0;
}

.team-name-inline {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
}

/* 单个"还原"按钮 */
.restore-btn {
  padding: var(--zl-space-xs) var(--zl-space-md);
  background: var(--zl-brand);
  color: var(--zl-text-inverse, #fff);
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-sm);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
  min-height: 32px;
}

.restore-btn:active {
  opacity: 0.85;
}

/* 二次确认文案 */
.confirm-text {
  font-size: var(--zl-font-base);
  line-height: var(--zl-line-normal);
  color: var(--zl-text-secondary);
  margin: 0;
}

/* 隐藏团队底部提示入口 */
.hidden-tip {
  text-align: center;
  padding: var(--zl-space-md);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  cursor: pointer;
  border-radius: var(--zl-radius-md);
  transition: background var(--zl-transition-fast), color var(--zl-transition-fast);
}

.hidden-tip:active {
  background: var(--zl-bg-cool);
  color: var(--zl-text-secondary);
}

/* ========== 创建 / 加入按钮（与原设计一致） ========== */
.action-buttons {
  display: flex;
  gap: var(--zl-space-md);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-sm);
  height: 44px;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  border: none;
  transition: opacity var(--zl-transition-fast);
}

.action-btn:active { opacity: 0.8; }

.create-btn {
  background: var(--zl-brand);
  color: var(--zl-text-inverse, #fff);
}

.join-btn {
  background: var(--zl-surface);
  color: var(--zl-text-primary);
  border: 1px solid var(--zl-border);
}
</style>
