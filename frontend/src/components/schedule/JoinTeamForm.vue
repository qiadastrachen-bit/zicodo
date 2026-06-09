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
          inputmode="numeric"
          pattern="[0-9]*"
          v-model="inviteCode"
          placeholder="输入6位数字邀请码"
          class="code-input"
          maxlength="6"
        />
        <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
      </div>

      <div class="modal-footer">
        <button
          class="btn-primary"
          @click="handleJoin"
          :disabled="inviteCode.length !== 6 || loading"
        >
          {{ loading ? '加入中...' : '加入' }}
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
const loading = ref(false)
const errorMsg = ref('')

async function handleJoin() {
  if (inviteCode.value.length !== 6) return
  loading.value = true
  errorMsg.value = ''
  try {
    await store.joinTeamByInviteCode(inviteCode.value)
    emit('join')
    emit('close')
  } catch (e) {
    // 邀请码错误/团队已满等细分文案，留待大范围测试后细化
    errorMsg.value = e.message || '加入失败，请稍后重试'
  } finally {
    loading.value = false
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: var(--zl-font-lg);
  font-weight: 600;
}

.header-spacer {
  width: 44px;
}

.code-input {
  width: 100%;
  padding: var(--zl-space-md);
  font-size: var(--zl-font-lg);
  text-align: center;
  letter-spacing: 0.2em;
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  background: var(--zl-surface);
}

.error-text {
  margin-top: var(--zl-space-sm);
  color: var(--zl-danger);
  font-size: var(--zl-font-sm);
  text-align: center;
}

.modal-footer {
  margin-top: var(--zl-space-lg);
}

.btn-primary {
  width: 100%;
  height: 44px;
  background: var(--zl-brand);
  color: #fff;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
