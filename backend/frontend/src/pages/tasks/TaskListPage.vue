<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ZlIcon from '@/components/common/ZlIcon.vue'
import { useScheduleStore } from '@/stores/schedule'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlInput from '@/components/common/ZlInput.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'

const router = useRouter()
const scheduleStore = useScheduleStore()

const searchQuery = ref('')

const filteredTasks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return scheduleStore.tasks
  return scheduleStore.tasks.filter(task => {
    const title = (task.title || '').toLowerCase()
    const note = (task.note || '').toLowerCase()
    return title.includes(q) || note.includes(q)
  })
})

const formatSubtitle = (task) => {
  const parts = []
  if (task.date) parts.push(task.date)
  if (task.startTime) parts.push(task.startTime)
  return parts.join(' ')
}

const goToTask = (id) => {
  router.push(`/tasks/${id}`)
}

const handleToggle = (e, task) => {
  e.stopPropagation()
  scheduleStore.toggleComplete(task.id)
}
</script>

<template>
  <div class="task-list-page">
    <ZlTopBar title="任务列表" @back="router.back()" />

    <div class="task-list-content">
      <ZlCard class="search-card">
        <div class="search-wrapper">
          <ZlIcon name="Search" :size="18" class="search-icon" />
          <ZlInput
            v-model="searchQuery"
            placeholder="搜索任务..."
            class="search-input"
          />
        </div>
      </ZlCard>

      <ZlCard v-if="filteredTasks.length > 0" class="task-list-card">
        <div v-for="task in filteredTasks" :key="task.id">
          <ZlListItem
            :title="task.title"
            :subtitle="formatSubtitle(task)"
            clickable
            arrow
            @click="goToTask(task.id)"
          >
            <ZlIcon
              :name="task.completed ? 'CheckCircle2' : 'Circle'"
              :size="20"
              :color="task.completed ? 'var(--zl-primary)' : 'var(--zl-text-hint)'"
              class="task-check"
              @click="(e) => handleToggle(e, task)"
            />
          </ZlListItem>
        </div>
      </ZlCard>

      <EmptyState
        v-else
        message="暂无匹配的任务"
        description="试试调整搜索关键词，或去创建新任务吧"
      />
    </div>
  </div>
</template>

<style scoped>
.task-list-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.task-list-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.search-card {
  padding: var(--zl-space-md);
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-md);
  padding: 0 var(--zl-space-md);
}

.search-icon {
  color: var(--zl-text-hint);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
}

.search-input :deep(.zl-input-wrapper) {
  background: transparent;
  border: none;
  box-shadow: none;
}

.task-list-card {
  padding: 0;
  overflow: hidden;
}

.task-check {
  cursor: pointer;
  flex-shrink: 0;
}
</style>
