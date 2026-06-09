<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Calendar, Plus, Check } from 'lucide-vue-next'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'
import ZlButton from '@/components/common/ZlButton.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import { useScheduleStore } from '@/stores/schedule'

const router = useRouter()
const scheduleStore = useScheduleStore()

// 闹钟列表：筛选 alarmEnabled 为 true 的任务
const alarmList = computed(() => {
  if (!scheduleStore.tasks) return []
  return scheduleStore.tasks.filter(task => task && task.alarmEnabled)
})

// 跳转到任务详情
const goToTaskDetail = (taskId) => {
  if (taskId) {
    router.push(`/tasks/${taskId}`)
  }
}

// 跳转到新建任务页面
const goToCreateTask = () => {
  router.push('/add')
}

onMounted(() => {
  console.log('NotificationPage mounted')
})
</script>

<template>
  <div class="notification-page">
    <ZlTopBar title="通知" @back="router.back()" />

    <div class="notification-content">
      <!-- 闹钟列表 -->
      <div class="alarm-section">
        <div class="section-header">
          <Bell class="section-icon" />
          <span class="section-title">闹钟</span>
        </div>

        <ZlCard class="alarm-card">
          <div v-if="alarmList && alarmList.length > 0" class="alarm-list">
            <div
              v-for="task in alarmList"
              :key="task.id"
              class="alarm-item"
              @click="goToTaskDetail(task.id)"
            >
              <div class="alarm-info">
                <Calendar class="alarm-icon" />
                <div class="alarm-details">
                  <div class="alarm-title">{{ task.title || '未命名任务' }}</div>
                  <div class="alarm-time" v-if="task.startTime">
                    {{ task.startTime }}
                    <span v-if="task.date" class="alarm-date"> · {{ task.date }}</span>
                  </div>
                </div>
              </div>
              <div class="alarm-tags">
                <span v-if="task.repeatAlarm" class="tag repeat-tag">
                  <Check class="tag-icon" />
                  重复
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empty-alarm">
            <p class="empty-text">暂无闹钟</p>
            <p class="empty-hint">点击下方按钮添加闹钟</p>
          </div>
        </ZlCard>

        <ZlButton
          type="primary"
          block
          class="add-alarm-btn"
          @click="goToCreateTask"
        >
          <Plus class="btn-icon" />
          新建闹钟
        </ZlButton>
      </div>

      <!-- 系统通知占位 -->
      <div class="notification-section">
        <div class="divider">
          <span class="divider-text">系统通知</span>
        </div>

        <ZlCard class="notification-card">
          <LoadingState :messages="['系统通知', '即将上线']" />
          <div class="system-notification-placeholder">
            <ZlListItem
              :icon="Bell"
              title="系统通知"
              subtitle="V0.1.0 版本上线"
            />
          </div>
        </ZlCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.notification-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

/* 区域标题 */
.section-header {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
  margin-bottom: var(--zl-space-md);
}

.section-icon {
  color: var(--zl-brand);
  width: 20px;
  height: 20px;
}

.section-title {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-semibold);
  color: var(--zl-text-primary);
}

/* 闹钟卡片 */
.alarm-card {
  padding: 0;
}

.alarm-list {
  display: flex;
  flex-direction: column;
}

.alarm-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-md);
  cursor: pointer;
  transition: background var(--zl-transition-fast);
  border-bottom: 1px solid var(--zl-border);
}

.alarm-item:last-child {
  border-bottom: none;
}

.alarm-item:active {
  background: var(--zl-bg-cool);
}

.alarm-info {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
}

.alarm-icon {
  color: var(--zl-text-hint);
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alarm-details {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-1);
}

.alarm-title {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
}

.alarm-time {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.alarm-date {
  color: var(--zl-text-hint);
}

.alarm-tags {
  display: flex;
  gap: var(--zl-space-2);
}

.tag {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: var(--zl-space-1) var(--zl-space-2);
  border-radius: var(--zl-radius-sm);
  font-size: var(--zl-font-xs);
}

.repeat-tag {
  background: var(--zl-brand-light);
  color: var(--zl-brand-dark);
}

.tag-icon {
  width: 12px;
  height: 12px;
}

.empty-alarm {
  padding: var(--zl-space-xl) var(--zl-space-md);
  text-align: center;
}

.empty-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-secondary);
  margin: 0 0 var(--zl-space-1) 0;
}

.empty-hint {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  margin: 0;
}

/* 新建闹钟按钮 */
.add-alarm-btn {
  width: 100%;
  margin-top: var(--zl-space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-2);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* 系统通知区域 */
.divider {
  display: flex;
  align-items: center;
  margin: var(--zl-space-md) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--zl-border);
}

.divider-text {
  padding: 0 var(--zl-space-md);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.notification-card {
  padding: 0;
}

.system-notification-placeholder {
  border-top: 1px solid var(--zl-border);
}
</style>
