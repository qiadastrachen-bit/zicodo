<template>
  <div class="schedule-page">
    <!-- 顶部栏：铃铛 | 个人/团队 Tab | 搜索 -->
    <div class="schedule-header">
      <button class="header-icon-btn" @click="showNotificationTip">
        <ZlIcon name="Bell" :size="22" />
      </button>

      <!-- 个人/团队切换 -->
      <div class="tab-switcher">
        <span
          class="tab-item"
          :class="{ active: currentView === 'personal' }"
          @click="currentView = 'personal'"
        >
          个人
        </span>
        <span
          class="tab-item"
          :class="{ active: currentView === 'team' }"
          @click="currentView = 'team'"
        >
          团队
        </span>
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </div>

      <button class="header-icon-btn" @click="showSearchTip">
        <ZlIcon name="Search" :size="22" />
      </button>
    </div>

    <!-- 个人任务列表 -->
    <div v-if="currentView === 'personal'" class="schedule-content">
      <!-- 今日任务 -->
      <div class="task-section">
        <div class="section-header">
          <h3 class="section-title">今日任务</h3>
          <button class="add-btn" @click="openForm()">
            <ZlIcon name="Plus" :size="20" />
          </button>
        </div>
        <TaskCard
          v-for="task in store.todayTasks"
          :key="task.id"
          :task="task"
          @toggle="onToggleTask"
          @click="openForm(task)"
        />
        <div v-if="store.todayTasks.length === 0" class="empty-tip">
          今日暂无任务
        </div>
      </div>

      <!-- 本周/本月任务 -->
      <div class="task-section" v-if="store.monthTasks.length > 0">
        <div class="section-header">
          <h3 class="section-title">本周/本月任务</h3>
        </div>
        <TaskCard
          v-for="task in store.monthTasks"
          :key="task.id"
          :task="task"
          @toggle="onToggleTask"
          @click="openForm(task)"
        />
      </div>

      <!-- 其他 -->
      <div class="task-section" v-if="store.otherTasks.length > 0">
        <div class="section-header">
          <h3 class="section-title">其他</h3>
        </div>
        <TaskCard
          v-for="task in store.otherTasks"
          :key="task.id"
          :task="task"
          @toggle="onToggleTask"
          @click="openForm(task)"
        />
      </div>
    </div>

    <!-- 团队功能 -->
    <div v-else class="team-content">
      <!-- 团队列表视图 -->
      <template v-if="teamsStore.currentView === 'list'">
        <div class="section-header">
          <h3 class="section-title">团队列表</h3>
          <div class="header-actions">
            <button class="join-team-btn" @click="showJoinForm = true">
              <ZlIcon name="LogIn" :size="18" />
              <span>加入</span>
            </button>
            <button class="add-btn" @click="showCreateForm = true">
              <ZlIcon name="Plus" :size="20" />
            </button>
          </div>
        </div>
        <TeamCard
          v-for="team in teamsStore.visibleTeams"
          :key="team.id"
          :team="team"
          @click="teamsStore.openTeam(team)"
        />
        <EmptyState
          v-if="!teamsStore.visibleTeams.length"
          message="您还没有加入团队"
          description="使用右上角按钮创建或加入团队"
        />
      </template>

      <!-- 团队详情视图 -->
      <template v-if="teamsStore.currentView === 'detail'">
        <TeamDetail
          :team="teamsStore.currentTeam"
          @close="teamsStore.closeTeam()"
          @open-tasks="teamsStore.openTasks()"
          @open-members="teamsStore.openMembers()"
        />
      </template>

      <!-- 成员列表视图 -->
      <template v-if="teamsStore.currentView === 'members'">
        <MemberList
          :team="teamsStore.currentTeam"
          @close="teamsStore.closeDetail()"
        />
      </template>

      <!-- 团队任务视图 -->
      <template v-if="teamsStore.currentView === 'tasks'">
        <TeamTaskPage
          :team="teamsStore.currentTeam"
          @close="teamsStore.closeDetail()"
        />
      </template>

      <!-- 新建团队弹窗 -->
      <TeamCreateForm
        v-if="showCreateForm"
        @close="showCreateForm = false"
        @submit="loadTeams"
      />

      <!-- 加入团队弹窗 -->
      <JoinTeamForm
        v-if="showJoinForm"
        @close="showJoinForm = false"
        @join="loadTeams"
      />
    </div>

    <!-- 新建/编辑任务弹窗 -->
    <TaskForm
      v-if="store.showForm"
      :task="store.editingTask"
      @close="store.closeForm"
      @submit="handleSubmit"
      @delete="handleDelete"
      @checkin="handleCheckIn"
    />

    <!-- 打卡计时器弹窗 -->
    <CheckInTimer
      v-if="store.showTimer"
      :task="store.timerTask"
      @close="store.closeTimer"
      @complete="handleCheckInComplete"
    />

    <!-- Toast 反馈 -->
    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />
  </div>
</template>

<script>
export default {
  name: 'TaskCreatePage'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ZlIcon from '@/components/common/ZlIcon.vue'
import { useScheduleStore } from '@/stores/schedule.js'
import { usePetStore } from '@/stores/pet.js'
import TaskCard from '@/components/schedule/TaskCard.vue'
import TaskForm from '@/components/schedule/TaskForm.vue'
import CheckInTimer from '@/components/schedule/CheckInTimer.vue'
import ZlToast from '@/components/common/ZlToast.vue'
import { useTeamsStore } from '@/stores/teams.js'
import TeamCard from '@/components/schedule/TeamCard.vue'
import TeamCreateForm from '@/components/schedule/TeamCreateForm.vue'
import JoinTeamForm from '@/components/schedule/JoinTeamForm.vue'
import TeamDetail from '@/components/schedule/TeamDetail.vue'
import TeamTaskPage from '@/components/schedule/TeamTaskPage.vue'
import MemberList from '@/components/schedule/MemberList.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const store = useScheduleStore()
const petStore = usePetStore()
const teamsStore = useTeamsStore()
const currentView = ref('personal')
const showJoinForm = ref(false)
const showCreateForm = ref(false)

// 打卡 Toast 反馈
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

onMounted(() => {
  store.fetchTasksFromBackend()
  teamsStore.fetchTeams().catch(() => {})
})

async function onToggleTask(taskId) {
  const result = await store.toggleComplete(taskId)
  if (result && result.levelUp) {
    toastMessage.value = `🎉 打卡成功！宠物升级到 Lv${result.pet?.level || '新'}！+${result.pointsEarned || 0} 积分`
    toastType.value = 'success'
    showToast.value = true
    if (result.pet) petStore.updatePetLocal(result.pet)
  } else if (result && result.pointsEarned) {
    toastMessage.value = `✅ 打卡成功！+${result.pointsEarned} 积分`
    toastType.value = 'success'
    showToast.value = true
    if (result.pet) petStore.updatePetLocal(result.pet)
  }
}

// Tab 指示器位置
const indicatorStyle = computed(() => {
  const index = currentView.value === 'personal' ? 0 : 1
  return {
    transform: `translateX(${index * 100}%)`
  }
})

function openForm(task = null) {
  store.openForm(task)
}

function handleSubmit(data) {
  if (data.id) {
    store.updateTask(data.id, data)
  } else {
    store.addTask(data)
  }
  store.closeForm()
}

function handleDelete(taskId) {
  if (confirm('确定要删除这个任务吗？')) {
    store.deleteTask(taskId)
    store.closeForm()
  }
}

function handleCheckIn(task) {
  store.closeForm()
  store.openTimer(task)
}

function handleCheckInComplete(checkInData) {
  if (store.timerTask) {
    store.updateTask(store.timerTask.id, {
      completed: true,
      checkInStart: checkInData.startTime,
      checkInEnd: checkInData.endTime
    })
  }
  store.closeTimer()
}

function showNotificationTip() {
  router.push('/notifications')
}

function showSearchTip() {
  // alert('搜索功能即将上线')
}

function loadTeams() {
  showCreateForm.value = false
  showJoinForm.value = false
}
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
  background: var(--zl-bg);
  padding-bottom: var(--zl-tabbar-height);
}

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-2) var(--zl-space-4);
  background: var(--zl-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--zl-text-secondary);
  cursor: pointer;
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
}

.header-icon-btn:active {
  background: var(--zl-border);
}

.tab-switcher {
  display: flex;
  position: relative;
  gap: var(--zl-space-6);
}

.tab-item {
  font-size: var(--zl-font-lg);
  color: var(--zl-text-hint);
  cursor: pointer;
  padding: var(--zl-space-1) 0;
  transition: color var(--zl-transition-fast);
  position: relative;
}

.tab-item.active {
  color: var(--zl-text-primary);
  font-weight: var(--zl-weight-medium);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  background: var(--zl-brand);
  border-radius: 2px;
  transition: transform var(--zl-transition-normal);
}

.schedule-content,
.team-content {
  padding: var(--zl-space-3) var(--zl-space-4);
}

.task-section {
  margin-bottom: var(--zl-space-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--zl-space-3);
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  margin: 0;
}

.add-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--zl-brand);
}

.empty-tip {
  text-align: center;
  padding: var(--zl-space-8);
  color: var(--zl-text-hint);
  font-size: var(--zl-font-sm);
}

/* 团队列表：标题右侧操作按钮容器 */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
}

/* 加入团队按钮（次级按钮：白底 + 品牌色边框/文字） */
.join-team-btn {
  display: flex;
  align-items: center;
  gap: var(--zl-space-1);
  padding: var(--zl-space-1) var(--zl-space-3);
  background: var(--zl-surface);
  border: 1px solid var(--zl-brand);
  border-radius: var(--zl-radius-md);
  color: var(--zl-brand);
  font-size: var(--zl-font-sm);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.join-team-btn:active {
  opacity: 0.8;
}

/* 创建团队按钮（保持品牌色风格，用于 EmptyState 区域） */
.create-team-btn {
  display: flex;
  align-items: center;
  gap: var(--zl-space-1);
  padding: var(--zl-space-1) var(--zl-space-3);
  background: var(--zl-brand);
  border: none;
  border-radius: var(--zl-radius-md);
  color: var(--zl-text-inverse);
  font-size: var(--zl-font-sm);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.create-team-btn:active {
  opacity: 0.8;
}

</style>
