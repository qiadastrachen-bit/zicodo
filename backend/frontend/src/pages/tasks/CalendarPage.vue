<script setup>
/**
 * CalendarPage.vue - 日历页
 * 展示月视图、滑动手势、选中日期任务列表
 */
import { computed, ref, onMounted } from 'vue'
import { useScheduleStore } from '@/stores/schedule'
import { usePetStore } from '@/stores/pet'
import { useRouter } from 'vue-router'
import TaskCard from '@/components/schedule/TaskCard.vue'
import TaskForm from '@/components/schedule/TaskForm.vue'
import ZlToast from '@/components/common/ZlToast.vue'
import {
  formatLocalDate,
  formatDateStr,
  matchesRecurrence
} from '@/utils/date'
import ZlIcon from '@/components/common/ZlIcon.vue'

const store = useScheduleStore()
const petStore = usePetStore()
const router = useRouter()

// Toast 反馈（打卡成功 + 积分 + 升级）
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 页面加载时从后端拉取一次任务
onMounted(() => {
  store.fetchTasksFromBackend()
})

// 打卡（调后端 + 显示 Toast + 同步宠物信息）
async function onToggleTask(taskId) {
  const result = await store.toggleComplete(taskId)
  if (result && result.levelUp) {
    toastMessage.value = `🎉 打卡成功！宠物升级到 Lv${result.pet?.level || '新'}！+${result.pointsEarned || 0} 积分`
    toastType.value = 'success'
    showToast.value = true
    // 同步刷新宠物信息
    if (result.pet) petStore.updatePetLocal(result.pet)
  } else if (result && result.pointsEarned) {
    toastMessage.value = `✅ 打卡成功！+${result.pointsEarned} 积分`
    toastType.value = 'success'
    showToast.value = true
    if (result.pet) petStore.updatePetLocal(result.pet)
  }
}

// 星期表头
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

// 触摸手势
let touchStartX = 0
let touchEndX = 0

function onTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX
}

function onTouchMove(e) {
  touchEndX = e.changedTouches[0].screenX
}

function onTouchEnd() {
  const diff = touchStartX - touchEndX
  const threshold = 50
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      store.goToNextMonth()
    } else {
      store.goToPrevMonth()
    }
  }
  touchStartX = 0
  touchEndX = 0
}

// 生成日历网格数据
const calendarGrid = computed(() => {
  const { year, month } = store.currentCalendarMonth
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = formatLocalDate(new Date())

  // 上个月的尾巴
  const prevMonthDays = new Date(year, month, 0).getDate()
  const prefix = []
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    prefix.push({
      day: d,
      dateStr: formatDateStr(y, m, d),
      isCurrentMonth: false
    })
  }

  // 本月日期
  const current = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d)
    current.push({
      day: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === store.selectedDate,
      hasTasks: hasTasksOnDate(dateStr)
    })
  }

  // 下个月的开头
  const totalCells = Math.ceil((prefix.length + current.length) / 7) * 7
  const suffixCount = totalCells - prefix.length - current.length
  const suffix = []
  for (let d = 1; d <= suffixCount; d++) {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    suffix.push({
      day: d,
      dateStr: formatDateStr(y, m, d),
      isCurrentMonth: false
    })
  }

  return [...prefix, ...current, ...suffix]
})

// 判断某天是否有任务
function hasTasksOnDate(dateStr) {
  return store.tasks.some(task => {
    if (task.type !== 'personal') return false
    if (task.date === dateStr) return true
    if (task.recurrence) {
      const d = new Date(dateStr)
      return matchesRecurrence(task.recurrence, d)
    }
    return false
  })
}

// 月份显示文字
const monthDisplay = computed(() => {
  const { year, month } = store.currentCalendarMonth
  return `${year}年 ${month + 1}月`
})

// 点击日期
function onDateClick(cell) {
  store.selectDate(cell.dateStr)
}

// 编辑任务
function onEditTask(task) {
  store.openForm(task)
}
</script>

<template>
  <div
    class="calendar-page"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 月份导航 -->
    <div class="month-nav">
      <button class="nav-btn" @click="store.goToPrevMonth()">
        <ZlIcon name="ChevronLeft" :size="22" />
      </button>
      <span class="month-title">{{ monthDisplay }}</span>
      <button class="nav-btn" @click="store.goToNextMonth()">
        <ZlIcon name="ChevronRight" :size="22" />
      </button>
    </div>

    <!-- 星期表头 -->
    <div class="week-header">
      <span v-for="day in WEEK_DAYS" :key="day" class="week-day">{{ day }}</span>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <div
        v-for="(cell, idx) in calendarGrid"
        :key="idx"
        class="day-cell"
        :class="{
          'other-month': !cell.isCurrentMonth,
          'is-today': cell.isToday,
          'is-selected': cell.isSelected && !cell.isToday,
          'has-tasks': cell.hasTasks && cell.isCurrentMonth
        }"
        @click="onDateClick(cell)"
      >
        <span class="day-number">{{ cell.day }}</span>
        <span v-if="cell.hasTasks && cell.isCurrentMonth" class="task-dot"></span>
      </div>
    </div>

    <!-- 选中日期的任务列表 -->
    <div class="day-tasks">
      <div class="day-tasks-header">
        <h3 class="day-tasks-title">待办</h3>
        <span class="day-tasks-count">{{ store.tasksForSelectedDate.length }} 项</span>
      </div>

      <div v-if="store.tasksForSelectedDate.length === 0" class="empty-hint">
        暂无任务
      </div>

      <TaskCard
        v-for="task in store.tasksForSelectedDate"
        :key="task.id"
        :task="task"
        :minimal="true"
        @toggle="onToggleTask(task.id)"
        @click="router.push({ name: 'TaskDetail', params: { id: task.id } })"
        @edit="onEditTask(task)"
      />
    </div>

    <!-- Toast 反馈 -->
    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />

    <!-- 新建任务按钮（复用 TaskForm） -->
    <Teleport to="body">
      <TaskForm
        v-if="store.showForm"
        :task="store.editingTask"
        @submit="(data) => {
          if (data.id) {
            store.updateTask(data.id, data)
          } else {
            store.addTask(data)
          }
          store.closeForm()
        }"
        @delete="(taskId) => {
          store.deleteTask(taskId)
          store.closeForm()
        }"
        @checkin="(task) => {
          store.closeForm()
          store.openTimer(task)
        }"
        @close="store.closeForm()"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-page {
  padding: var(--zl-space-4, 16px);
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--zl-bg, #FFFAF1);
  user-select: none;
  -webkit-user-select: none;
}

/* ========== 月份导航 ========== */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-6, 24px);
  padding: var(--zl-space-3, 12px) 0;
  margin-bottom: var(--zl-space-4, 16px);
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--zl-radius-full, 50%);
  background: transparent;
  color: var(--zl-text-primary, #000000);
  cursor: pointer;
  transition: background var(--zl-transition-fast, 150ms ease);
}
.nav-btn:active {
  background: var(--zl-border, #E5E5E5);
}

.month-title {
  font-size: var(--zl-font-lg, 20px);
  font-weight: var(--zl-weight-bold, 700);
  color: var(--zl-text-primary, #000000);
  min-width: 130px;
  text-align: center;
  letter-spacing: 0.05em;
}

/* ========== 星期表头 ========== */
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--zl-space-2, 8px);
}
.week-day {
  text-align: center;
  font-size: var(--zl-font-xs, 12px);
  color: var(--zl-text-hint, #999999);
  padding: var(--zl-space-2, 8px) 0;
  font-weight: var(--zl-weight-medium, 500);
}

/* ========== 日历网格 ========== */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: var(--zl-space-6, 24px);
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: var(--zl-radius-md, 12px);
  cursor: pointer;
  transition: all var(--zl-transition-fast, 150ms ease);
  position: relative;
  gap: 3px;
}
.day-cell:active {
  transform: scale(0.92);
  background: rgba(135, 200, 180, 0.08);
}

.day-cell.other-month {
  opacity: 0.25;
}

.day-cell.other-month .day-number {
  color: var(--zl-text-hint, #999999);
}

/* 今天：填充薄荷圆 */
.day-cell.is-today .day-number {
  background: var(--zl-brand, #87C8B4);
  color: #FFFFFF;
  border-radius: var(--zl-radius-full, 50%);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--zl-weight-bold, 700);
}

/* 选中（非今天）：薄荷环 */
.day-cell.is-selected .day-number {
  border: 2px solid var(--zl-brand, #87C8B4);
  border-radius: var(--zl-radius-full, 50%);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-brand, #87C8B4);
  font-weight: var(--zl-weight-bold, 700);
}

.day-number {
  font-size: var(--zl-font-sm, 14px);
  color: var(--zl-text-primary, #000000);
  font-weight: var(--zl-weight-regular, 400);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 任务小圆点 */
.task-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--zl-brand, #87C8B4);
}

/* ========== 待办区域 ========== */
.day-tasks {
  margin-top: var(--zl-space-2, 8px);
}

.day-tasks-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--zl-space-3, 12px);
  padding: 0 var(--zl-space-1, 4px);
}

.day-tasks-title {
  font-size: var(--zl-font-lg, 20px);
  font-weight: var(--zl-weight-bold, 700);
  color: var(--zl-text-primary, #000000);
  margin: 0;
}

.day-tasks-count {
  font-size: var(--zl-font-sm, 14px);
  color: var(--zl-text-hint, #999999);
  font-weight: var(--zl-weight-regular, 400);
}

.empty-hint {
  text-align: center;
  padding: var(--zl-space-10, 40px) 0;
  color: var(--zl-text-hint, #999999);
  font-size: var(--zl-font-sm, 14px);
}
</style>
