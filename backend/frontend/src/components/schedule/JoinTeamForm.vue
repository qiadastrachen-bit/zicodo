<template>
  <div class="join-overlay" @click.self="$emit('close')">
    <div class="join-modal">
      <div class="modal-header">
        <button class="close-btn" @click="$emit('close')">
          <ZlIcon name="X" :size="24" />
        </button>
        <h3 class="modal-title">加入团队</h3>
        <div class="header-spacer"></div>
      </div>
      
      <div class="modal-body">
        <input 
          type="text" 
          v-model="inviteCode"
          placeholder="输入6位数字邀请码"
          class="code-input"
          maxlength="6"
        />
      </div>
      
      <div class="modal-footer">
        <button 
          class="btn-primary"
          @click="handleJoin"
          :disabled="inviteCode.length !== 6"
        >
          加入
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTeamsStore } from '@/stores/teams.js'
import ZlIcon from '@/components/common/ZlIcon.vue'

const emit = defineEmits(['close', 'join'])
const store = useTeamsStore()
const inviteCode = ref('')

function handleJoin() {
  const team = store.findTeamByInviteCode(inviteCode.value)
  if (team) {
    store.joinTeam(team.id)
    emit('join')
    emit('close')
  } else {
    alert('邀请码无效')
  }
}
</script>

<style scoped>
.join-overlay {
  position: fixed;
  inset: 0;
  background: var(--zl-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-md);
}

.join-modal {
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  width: 100%;
  max-width: 400px;
  padding: var(--zl-space-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zl-space-lg);
}

.close-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--zl-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--zl-radius-full);
  transition: background var(--zl-transition-fast);
}

.close-btn:active {
  background: var(--zl-border);
}

.modal-title {
  font-size: var(--zl-font-lg);
  font-weight: 500;
  color: var(--zl-text-primary);
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
  margin-bottom: var(--zl-space-lg);
}

.code-input {
  width: 100%;
  padding: var(--zl-space-sm) var(--zl-space-md);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  background: white;
  transition: border-color var(--zl-transition-fast);
  box-sizing: border-box;
  text-align: center;
  letter-spacing: 8px;
  font-size: 20px;
}

.code-input:focus {
  outline: none;
  border-color: var(--zl-brand);
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: var(--zl-space-sm) var(--zl-space-xl);
  background: var(--zl-brand);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
