<template>
  <div class="task-card" :class="{ completed: task.completed, compact: minimal || compact, minimal: minimal }">
    <!-- 复选框 -->
    <div class="checkbox" @click.stop="emit('toggle', task.id)">
      <ZlIcon v-if="task.completed" name="Check" :size="14" class="check-icon" />
    </div>

    <!-- 内容 -->
    <div class="task-content" @click="emit('click', task)">
      <div class="task-title">{{ task.title }}</div>
      <div v-if="!minimal" class="task-meta">
        <!-- 日期（日历模式显示） -->
        <span v-if="showDate && task.date" class="task-date">
          {{ formatShortDate(task.date) }}
        </span>
        <!-- 被指派人（团队任务显示） -->
        <span v-if="showAssignee && task.assigneeName" class="task-assignee">
          {{ task.assigneeName }}
        </span>
        <!-- 时间 -->
        <span v-if="showTime && (task.startTime || task.recurrence)" class="task-time">
          <span v-if="task.startTime && task.endTime">
            {{ formatTime(task.startTime) }} - {{ formatTime(task.endTime) }}
          </span>
          <span v-else-if="task.startTime">
            {{ formatTime(task.startTime) }}
          </span>
          <span v-else-if="task.recurrence" class="recurrence-tag">
            {{ task.recurrence }}
          </span>
        </span>
      </div>
    </div>

    <!-- 右侧图标（非紧凑/非极简模式显示） -->
    <div v-if="!minimal && !compact" class="task-actions">
      <ZlIcon
        v-if="!task.completed && task.startTime"
        name="Pencil"
        :size="16"
        class="action-icon"
        @click.stop="emit('edit', task)"
      />
      <ZlIcon
        name="Bell"
        :size="16"
        class="action-icon"
        :class="{ active: task.alarmEnabled }"
        @click.stop="emit('toggle-alarm', task.id)"
      />
    </div>
  </div>
</template>

<script setup>
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  task: { type: Object, required: true },
  // 紧凑模式（隐藏操作图标）
  compact: { type: Boolean, default: false },
  // 极简模式（仅复选框+标题，用于日历页）
  minimal: { type: Boolean, default: false },
  // 显示日期
  showDate: { type: Boolean, default: false },
  // 显示时间
  showTime: { type: Boolean, default: true },
  // 显示被指派人（团队任务用）
  showAssignee: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle', 'click', 'edit', 'toggle-alarm'])

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  return `${displayHour}:${m} ${ampm}`
}

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>

<style scoped>
.task-card {
  display: flex;
  align-items: center;
  gap: var(--zl-space-3, 12px);
  padding: var(--zl-space-4, 16px);
  background: var(--zl-surface, #FFFFFF);
  border-radius: var(--zl-radius-md, 12px);
  margin-bottom: var(--zl-space-3, 12px);
  box-shadow: var(--zl-shadow-sm, 0 2px 8px rgba(0,0,0,0.08));
  transition: all var(--zl-transition-fast, 150ms ease);
}
.task-card:active {
  transform: scale(0.98);
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid var(--zl-border, #E5E5E5);
  border-radius: var(--zl-radius-sm, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--zl-transition-fast, 150ms ease);
}

.task-card.completed .checkbox {
  background: var(--zl-brand, #87C8B4);
  border-color: var(--zl-brand, #87C8B4);
}

.check-icon {
  color: white;
}

.task-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.task-title {
  font-size: var(--zl-font-base, 16px);
  color: var(--zl-text-primary, #000000);
  font-weight: var(--zl-weight-medium, 500);
  margin-bottom: var(--zl-space-1, 4px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--zl-text-hint, #999999);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2, 8px);
  font-size: var(--zl-font-sm, 14px);
  color: var(--zl-text-secondary, #666666);
  flex-wrap: wrap;
}

.task-date {
  color: var(--zl-text-secondary, #666666);
}

.task-time {
  color: var(--zl-text-hint, #999999);
}

.recurrence-tag {
  color: var(--zl-brand, #87C8B4);
  font-size: var(--zl-font-xs, 12px);
}

.task-assignee {
  color: var(--zl-brand, #87C8B4);
  font-size: var(--zl-font-xs, 12px);
  background: var(--zl-brand-tint);
  padding: 2px 8px;
  border-radius: var(--zl-radius-sm, 8px);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2, 8px);
}

.action-icon {
  color: var(--zl-text-hint, #999999);
  flex-shrink: 0;
  cursor: pointer;
  transition: color var(--zl-transition-fast, 150ms ease);
}

.action-icon.active {
  color: var(--zl-brand, #87C8B4);
}

/* 紧凑模式 */
.task-card.compact {
  padding: var(--zl-space-3, 12px);
  margin-bottom: var(--zl-space-2, 8px);
}

.task-card.compact .task-title {
  font-size: var(--zl-font-sm, 14px);
}

/* 极简模式（日历页用） */
.task-card.minimal {
  padding: var(--zl-space-3, 12px) var(--zl-space-4, 16px);
  margin-bottom: var(--zl-space-2, 8px);
  box-shadow: none;
  border: 1px solid var(--zl-border, #E5E5E5);
}

.task-card.minimal .checkbox {
  width: 20px;
  height: 20px;
}

.task-card.minimal .task-title {
  margin-bottom: 0;
  font-size: var(--zl-font-base, 16px);
}
</style>
