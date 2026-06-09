<template>
  <div class="member-list-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <button class="back-btn" @click="$emit('close')">
        <ZlIcon name="ChevronLeft" :size="24" />
      </button>
      <h3 class="page-title">{{ team.name }}</h3>
      <div class="header-spacer"></div>
    </div>
    
    <!-- 成员列表 -->
    <div class="member-list">
      <div 
        v-for="member in team.members" 
        :key="member.id" 
        class="member-row"
      >
        <div class="member-avatar">{{ (member.username || '?')[0] }}</div>
        <div class="member-info">
          <span class="member-name">{{ member.username }}</span>
          <span class="member-role">{{ member.totalPoints !== undefined ? member.totalPoints + ' 积分' : '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  team: { type: Object, required: true }
})

const emit = defineEmits(['close'])
</script>

<style scoped>
.member-list-page {
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
  width: 32px;
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
</style>
