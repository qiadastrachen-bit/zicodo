<template>
  <div class="team-detail">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <button class="back-btn" @click="$emit('close')">
        <ZlIcon name="ChevronLeft" :size="24" />
      </button>
      <h3 class="detail-title">{{ team.name }}</h3>
      <div class="header-spacer"></div>
    </div>
    
    <!-- 邀请码 -->
    <div class="team-code">
      <span>邀请码：{{ team.inviteCode }}</span>
      <button class="copy-btn" @click="store.copyInviteCode(team.inviteCode)">复制</button>
    </div>

    <!-- 任务卡片（大卡片，带箭头） -->
    <div class="task-card" @click="$emit('open-tasks', team)">
      <div class="task-card-inner">
        <span class="task-label">任务</span>
        <span class="task-badge" v-if="team.tasks?.length">{{ team.tasks.length }}</span>
      </div>
      <ZlIcon name="ChevronRight" :size="20" color="var(--zl-text-hint)" />
    </div>
    
    <!-- 成员列表入口 -->
    <div class="members-entry" @click="$emit('open-members', team)">
      <span class="members-label">成员列表</span>
      <ZlIcon name="ChevronRight" :size="20" color="var(--zl-text-hint)" />
    </div>
    
    <!-- 成员及任务预览 -->
    <div class="member-list">
      <div 
        v-for="member in team.members" 
        :key="member.id" 
        class="member-row"
      >
        <div class="member-avatar">{{ (member.nickname || member.username || '?')[0] }}</div>
        <div class="member-info">
          <span class="member-name">{{ member.nickname || member.username }}</span>
          <span class="member-role">{{ member.totalPoints !== undefined ? member.totalPoints + ' 积分' : '' }}</span>
        </div>
        <div class="member-task">
          {{ getMemberTask(member) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTeamsStore } from '@/stores/teams.js'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  team: { type: Object, required: true },
  isLeader: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'open-tasks', 'open-members'])
const store = useTeamsStore()

function getMemberTask(member) {
  const task = props.team.tasks?.find(t => t.assignee === member.name)
  return task ? task.title : '暂无任务'
}
</script>

<style scoped>
.team-detail {
  padding: var(--zl-space-md);
  min-height: 100vh;
  background: var(--zl-bg);
}

.detail-header {
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

.detail-title {
  flex: 1;
  text-align: center;
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.header-spacer {
  width: 32px;
}

.team-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  margin-bottom: var(--zl-space-md);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.copy-btn {
  padding: var(--zl-space-xs) var(--zl-space-sm);
  background: var(--zl-brand);
  color: var(--zl-text-inverse);
  border: none;
  border-radius: var(--zl-radius-sm);
  font-size: var(--zl-font-sm);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.copy-btn:hover {
  opacity: 0.9;
}

.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-lg);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  box-shadow: var(--zl-shadow-sm);
  margin-bottom: var(--zl-space-md);
  cursor: pointer;
  transition: transform var(--zl-transition-fast);
}

.task-card:active {
  transform: scale(0.98);
}

.task-card-inner {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
}

.task-label {
  font-size: var(--zl-font-base);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.task-badge {
  background: var(--zl-brand);
  color: var(--zl-text-inverse);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.members-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-md);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  box-shadow: var(--zl-shadow-sm);
  margin-bottom: var(--zl-space-lg);
  cursor: pointer;
}

.members-label {
  font-size: var(--zl-font-base);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.member-list {
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  box-shadow: var(--zl-shadow-sm);
  overflow: hidden;
}

.member-row {
  display: flex;
  align-items: center;
  padding: var(--zl-space-md);
  border-bottom: 1px solid var(--zl-border);
}

.member-row:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--zl-brand);
  color: var(--zl-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: var(--zl-space-md);
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.member-name {
  font-size: var(--zl-font-base);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.member-role {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.member-task {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
