<script setup>
/**
 * TaskDetailPage.vue - 任务详情页
 * 展示任务完整信息、切换完成状态、编辑、删除
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScheduleStore } from '@/stores/schedule'
import { formatDateLabel, formatTime12 } from '@/utils/date'
import ZlIcon from '@/components/common/ZlIcon.vue'

const route = useRoute()
const router = useRouter()
const store = useScheduleStore()

const taskId = computed(() => route.params.id)
const task = computed(() => store.tasks.find(t => t.id === taskId.value))

function onToggleComplete() {
  if (task.value) store.toggleComplete(task.value.id)
}

function onEdit() {
  if (task.value) store.openForm(task.value)
}

function onDelete() {
  if (task.value && confirm('确定删除该任务？')) {
    store.deleteTask(task.value.id)
    router.back()
  }
}

function onBack() {
  router.back()
}
</script>

<template>
  <div class="task-detail-page" v-if="task">
    <!-- 顶部导航：返回 + 日期标题 -->
    <div class="page-header">
      <button class="back-btn" @click="onBack">
        <ZlIcon name="ArrowLeft" :size="22" />
      </button>
      <h1 class="page-title">{{ formatDateLabel(task.date) }}</h1>
      <div class="header-spacer"></div>
    </div>

    <!-- 任务标题卡片 -->
    <div class="title-card" :class="{ completed: task.completed }">
      <div class="checkbox" @click="onToggleComplete">
        <ZlIcon v-if="task.completed" name="Check" :size="16" class="check-icon" />
      </div>
      <span class="title-text">{{ task.title }}</span>
    </div>

    <!-- 信息卡片组 -->
    <div class="info-cards">
      <!-- 日期 -->
      <div class="info-card" v-if="task.date">
        <div class="info-icon">
          <ZlIcon name="Calendar" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">日期</div>
          <div class="info-value">{{ formatDateLabel(task.date) }}</div>
        </div>
      </div>

      <!-- 时间 -->
      <div class="info-card" v-if="task.startTime || task.endTime">
        <div class="info-icon">
          <ZlIcon name="Clock" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">时间</div>
          <div class="info-value">
            <span v-if="task.startTime">{{ formatTime12(task.startTime) }}</span>
            <span v-if="task.startTime && task.endTime" class="time-sep">—</span>
            <span v-if="task.endTime">{{ formatTime12(task.endTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 重复规则 -->
      <div class="info-card" v-if="task.recurrence">
        <div class="info-icon">
          <ZlIcon name="Clock" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">重复</div>
          <div class="info-value">{{ task.recurrence }}</div>
        </div>
      </div>

      <!-- 地点 -->
      <div class="info-card" v-if="task.location">
        <div class="info-icon">
          <ZlIcon name="MapPin" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">地点</div>
          <div class="info-value">{{ task.location }}</div>
        </div>
      </div>

      <!-- 备注 -->
      <div class="info-card" v-if="task.note">
        <div class="info-icon">
          <ZlIcon name="FileText" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">备注</div>
          <div class="info-value note-value">{{ task.note }}</div>
        </div>
      </div>

      <!-- 提醒 -->
      <div class="info-card">
        <div class="info-icon">
          <ZlIcon name="Bell" :size="18" />
        </div>
        <div class="info-content">
          <div class="info-label">提醒</div>
          <div class="info-value" :class="{ active: task.alarmEnabled }">
            {{ task.alarmEnabled ? '已开启' : '未开启' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button
        class="action-btn primary"
        :class="{ 'btn-completed': task.completed }"
        @click="onToggleComplete"
      >
        <ZlIcon name="Check" :size="18" />
        {{ task.completed ? '标记未完成' : '标记完成' }}
      </button>

      <div class="btn-row">
        <button class="action-btn secondary" @click="onEdit">
          <ZlIcon name="Pencil" :size="18" />
          编辑
        </button>
        <button class="action-btn danger" @click="onDelete">
          <ZlIcon name="Trash2" :size="18" />
          删除
        </button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <Teleport to="body">
      <TaskForm
        v-if="store.showForm"
        :task="store.editingTask"
        @save="(data) => { store.addTask(data); store.closeForm() }"
        @update="(id, data) => { store.updateTask(id, data); store.closeForm() }"
        @cancel="store.closeForm()"
      />
    </Teleport>
  </div>

  <!-- 任务不存在 -->
  <div class="task-detail-page" v-else>
    <div class="page-header">
      <button class="back-btn" @click="router.back()">
        <ZlIcon name="ArrowLeft" :size="22" />
      </button>
      <h1 class="page-title">任务详情</h1>
      <div class="header-spacer"></div>
    </div>
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">任务不存在或已被删除</div>
      <button class="back-link" @click="router.push('/calendar')">
        返回日历
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-detail-page {
  padding: var(--zl-space-4, 16px);
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--zl-bg, #FFFAF1);
}

/* ========== 顶部导航 ========== */
.page-header {
  display: flex;
  align-items: center;
  gap: var(--zl-space-3, 12px);
  padding: var(--zl-space-2, 8px) 0;
  margin-bottom: var(--zl-space-5, 20px);
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--zl-radius-full, 50%);
  background: var(--zl-surface, #FFFFFF);
  color: var(--zl-text-primary, #000000);
  cursor: pointer;
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
  transition: all var(--zl-transition-fast, 150ms ease);
}
.back-btn:active {
  transform: scale(0.92);
}
.page-title {
  font-size: var(--zl-font-lg, 20px);
  font-weight: var(--zl-weight-bold, 700);
  color: var(--zl-text-primary, #000000);
  margin: 0;
  flex: 1;
  text-align: center;
}
.header-spacer {
  width: 36px;
}

/* ========== 任务标题卡片 ========== */
.title-card {
  display: flex;
  align-items: center;
  gap: var(--zl-space-3, 12px);
  padding: var(--zl-space-4, 16px);
  background: var(--zl-surface, #FFFFFF);
  border-radius: var(--zl-radius-lg, 20px);
  margin-bottom: var(--zl-space-5, 20px);
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--zl-border, #E5E5E5);
  border-radius: var(--zl-radius-sm, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--zl-transition-fast, 150ms ease);
}

.title-card.completed .checkbox {
  background: var(--zl-brand, #87C8B4);
  border-color: var(--zl-brand, #87C8B4);
}

.check-icon {
  color: white;
}

.title-text {
  font-size: var(--zl-font-lg, 20px);
  font-weight: var(--zl-weight-medium, 500);
  color: var(--zl-text-primary, #000000);
}

.title-card.completed .title-text {
  text-decoration: line-through;
  color: var(--zl-text-hint, #999999);
}

/* ========== 信息卡片组 ========== */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-3, 12px);
  margin-bottom: var(--zl-space-6, 24px);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: var(--zl-space-3, 12px);
  padding: var(--zl-space-4, 16px);
  background: var(--zl-surface, #FFFFFF);
  border-radius: var(--zl-radius-lg, 20px);
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--zl-radius-md, 12px);
  background: rgba(135, 200, 180, 0.12);
  color: var(--zl-brand, #87C8B4);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: var(--zl-font-xs, 12px);
  color: var(--zl-text-hint, #999999);
  margin-bottom: var(--zl-space-1, 4px);
}

.info-value {
  font-size: var(--zl-font-base, 16px);
  color: var(--zl-text-primary, #000000);
  font-weight: var(--zl-weight-medium, 500);
}

.info-value.active {
  color: var(--zl-brand, #87C8B4);
}

.time-sep {
  color: var(--zl-text-hint, #999999);
  margin: 0 var(--zl-space-1, 4px);
}

.note-value {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: var(--zl-line-relaxed, 1.75);
  color: var(--zl-text-secondary, #666666);
  font-weight: var(--zl-weight-regular, 400);
}

/* ========== 操作按钮 ========== */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-3, 12px);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-2, 8px);
  width: 100%;
  padding: var(--zl-space-3, 12px) var(--zl-space-4, 16px);
  border: none;
  border-radius: var(--zl-radius-lg, 20px);
  font-size: var(--zl-font-base, 16px);
  font-weight: var(--zl-weight-medium, 500);
  cursor: pointer;
  transition: all var(--zl-transition-fast, 150ms ease);
  font-family: inherit;
}
.action-btn:active {
  transform: scale(0.97);
}

.action-btn.primary {
  background: var(--zl-brand, #87C8B4);
  color: #FFFFFF;
  height: 48px;
}
.action-btn.primary.btn-completed {
  background: var(--zl-text-hint, #999999);
}

.btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--zl-space-3, 12px);
}

.action-btn.secondary {
  background: var(--zl-surface, #FFFFFF);
  color: var(--zl-text-primary, #000000);
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
  height: 44px;
}

.action-btn.danger {
  background: var(--zl-surface, #FFFFFF);
  color: var(--zl-error, #EF4444);
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
  height: 44px;
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-16, 64px) 0;
  gap: var(--zl-space-4, 16px);
}
.empty-icon {
  font-size: 48px;
}
.empty-text {
  font-size: var(--zl-font-base, 16px);
  color: var(--zl-text-hint, #999999);
}
.back-link {
  color: var(--zl-brand, #87C8B4);
  font-size: var(--zl-font-base, 16px);
  font-weight: var(--zl-weight-medium, 500);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--zl-space-2, 8px) var(--zl-space-4, 16px);
}
</style>
