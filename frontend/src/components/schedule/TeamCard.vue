<template>
  <div class="team-card" @click="$emit('click', team)">
    <div class="team-info">
      <h3 class="team-name">{{ team.name }}</h3>
      <div class="team-meta">
        <ZlIcon name="Users" :size="14" class="member-icon" />
        <span class="team-members">{{ team.members?.length || 0 }}</span>
      </div>
    </div>
    <button
      class="menu-btn"
      @click.stop="$emit('menu', team)"
      aria-haspopup="menu"
      :aria-label="'团队 ' + team.name + ' 的操作菜单'"
    >
      <ZlIcon name="MoreHorizontal" :size="20" />
    </button>
  </div>
</template>

<script setup>
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  team: { type: Object, required: true }
})

const emit = defineEmits(['click', 'menu'])
</script>

<style scoped>
.team-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zl-space-4);
  background: var(--zl-surface);
  border-radius: var(--zl-radius-md);
  margin-bottom: var(--zl-space-3);
  box-shadow: var(--zl-shadow-sm);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.team-card:active {
  transform: scale(0.98);
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  margin: 0 0 var(--zl-space-1) 0;
}

.team-meta {
  display: flex;
  align-items: center;
  gap: var(--zl-space-1);
}

.member-icon {
  color: var(--zl-text-hint);
}

.team-members {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
}

.menu-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-hint);
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
  flex-shrink: 0;
}

.menu-btn:active {
  background: var(--zl-bg-cool);
}
</style>
