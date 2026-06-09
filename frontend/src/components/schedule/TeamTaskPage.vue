<template>
  <div class="team-task-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <button class="back-btn" @click="$emit('close')">
        <ZlIcon name="ChevronLeft" :size="24" />
      </button>
      <h3 class="page-title">团队任务</h3>
      <div class="header-spacer">
        <button
          v-if="isLeader"
          class="new-task-btn"
          @click="showTaskForm = true"
        >
          <ZlIcon name="Plus" :size="18" />
          <span>新建</span>
        </button>
      </div>
    </div>
    
    <!-- 分区标题：今日任务 -->
    <div class="section-title">今日任务</div>
    <TaskCard
      v-for="task in todayTasks"
      :key="task.id"
      :task="task"
      :show-assignee="true"
      @checkin="handleCheckIn(task)"
      @delete="handleDelete(task)"
      @sync="handleSync(task)"
    />
    <EmptyState v-if="!todayTasks.length" message="暂无今日任务" />
    
    <!-- 分区标题：本周任务 -->
    <div class="section-title">本周任务</div>
    <TaskCard
      v-for="task in weekTasks"
      :key="task.id"
      :task="task"
      :show-assignee="true"
      @checkin="handleCheckIn(task)"
      @delete="handleDelete(task)"
      @sync="handleSync(task)"
    />
    <EmptyState v-if="!weekTasks.length" message="暂无本周任务" />
    
    <!-- 打卡弹窗 -->
    <CheckInTimer
      v-if="activeTask"
      :task="activeTask"
      @close="activeTask = null"
      @complete="handleComplete"
    />

    <!-- 新建任务弹窗 -->
    <TaskForm
      v-if="showTaskForm"
      :is-team-task="true"
      :team-members="team.members"
      @close="showTaskForm = false"
      @submit="handleCreateTask"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTeamsStore } from '@/stores/teams.js'
import TaskCard from './TaskCard.vue'
import CheckInTimer from './CheckInTimer.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TaskForm from './TaskForm.vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  team: { type: Object, required: true },
  teamId: { type: String, default: '' }
})

const emit = defineEmits(['close'])
const store = useTeamsStore()
const activeTask = ref(null)
const showTaskForm = ref(false)

// 直接用 team 对象判断是否是组长，不依赖 teamId
// 三重判断：createdBy 字段 → member.role 包含'组长' → 团队唯一成员
const isLeader = computed(() => {
  if (!props.team) return false
  const currentUser = (() => {
    try {
      const data = localStorage.getItem('zl_user')
      if (!data) return 'guest'
      const user = JSON.parse(data)
      return user.username || user.name || 'guest'
    } catch { return 'guest' }
  })()

  // 判断 1：createdBy 字段（最可靠）
  if (props.team.createdBy && props.team.createdBy === currentUser) return true

  // 判断 2：member.role 包含'组长'
  const member = props.team.members?.find(m => m.name === currentUser)
  if (member && member.role?.includes('组长')) return true

  // 判断 3：团队只有一个成员且是当前用户
  if (props.team.members?.length === 1 && props.team.members[0].name === currentUser) return true

  return false
})

const todayTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.team.tasks?.filter(t => t.date === today) || []
})

const weekTasks = computed(() => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  
  return props.team.tasks?.filter(t => {
    const taskDate = new Date(t.date)
    return taskDate >= weekStart && taskDate < weekEnd && !todayTasks.value.includes(t)
  }) || []
})

function handleCheckIn(task) {
  activeTask.value = task
}

function handleDelete(task) {
  // 仅组长可删除
  if (!isLeader.value) return
  const index = props.team.tasks.findIndex(t => t.id === task.id)
  if (index !== -1) {
    props.team.tasks.splice(index, 1)
    store.updateTeam(props.team.id, { tasks: props.team.tasks })
  }
}

function handleSync(task) {
  store.syncTaskToPersonal(task)
}

function handleComplete(task) {
  task.completed = true
  store.updateTeam(props.team.id, { tasks: props.team.tasks })
  activeTask.value = null
}

function handleCreateTask(taskData) {
  const assigneeName = taskData.assignee ?
    props.team.members?.find(m => m.id === taskData.assignee)?.name : null

  store.addTeamTask(props.team.id, {
    ...taskData,
    assigneeId: taskData.assignee,
    assigneeName: assigneeName
  })

  showTaskForm.value = false
}
</script>

<style scoped>
.team-task-page {
  padding: var(--zl-space-md);
  min-height: 100vh;
  background: var(--zl-bg);
}

.page-header {
  display: flex;
  align-items: center;
  padding: var(--zl-space-md) 0;
  margin-bottom: var(--zl-space-lg);
}

.back-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-primary);
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
}

.back-btn:active {
  background: var(--zl-border);
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.header-spacer {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.new-task-btn {
  display: flex;
  align-items: center;
  gap: var(--zl-space-1);
  padding: var(--zl-space-1) var(--zl-space-3);
  background: var(--zl-brand);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.new-task-btn:active {
  opacity: 0.8;
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: var(--zl-space-lg) 0 var(--zl-space-md);
}
</style>
