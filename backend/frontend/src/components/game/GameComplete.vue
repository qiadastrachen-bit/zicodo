<template>
  <div class="game-complete-overlay">
    <div class="game-complete-modal">
      <!-- 标题 -->
      <div class="modal-header">
        <span class="header-icon">🎉</span>
        <h2 class="header-title">恭喜通关！</h2>
      </div>

      <!-- 得分 + 用时 -->
      <div class="modal-body">
        <div class="stat-item">
          <span class="stat-label">得分</span>
          <span class="stat-value">{{ score }} 分</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">用时</span>
          <span class="stat-value">{{ formatTime(time) }}</span>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="modal-footer">
        <button class="btn-restart" @click="$emit('restart')">
          再玩一局
        </button>
        <button class="btn-home" @click="router.push('/home')">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  score: { type: Number, required: true },
  time: { type: Number, required: true }
})

const emit = defineEmits(['restart'])
const router = useRouter()

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
.game-complete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.game-complete-modal {
  background: var(--zl-bg-card, #FFFFFF);
  border-radius: var(--zl-radius-lg, 20px);
  padding: var(--zl-space-xl, 32px);
  max-width: 320px;
  width: 80%;
  box-shadow: var(--zl-shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-sm, 8px);
  margin-bottom: var(--zl-space-lg, 24px);
}

.header-icon {
  font-size: 48px;
}

.header-title {
  font-size: var(--zl-font-size-xxl, 24px);
  color: var(--zl-brand, #87C8B4);
  font-weight: 500;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md, 16px);
  margin-bottom: var(--zl-space-lg, 24px);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: var(--zl-bg-soft, #F0F5F2);
  border-radius: var(--zl-radius-md, 12px);
}

.stat-label {
  font-size: var(--zl-font-size-base, 16px);
  color: var(--zl-text-hint, #636E72);
}

.stat-value {
  font-size: var(--zl-font-size-lg, 18px);
  color: var(--zl-text-primary, #000000);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm, 8px);
}

.btn-restart {
  width: 100%;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: var(--zl-brand, #87C8B4);
  color: var(--zl-text-secondary, #FFFFFF);
  border: none;
  border-radius: var(--zl-radius-md, 12px);
  font-size: var(--zl-font-size-base, 16px);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-restart:hover {
  opacity: 0.9;
}

.btn-home {
  width: 100%;
  padding: var(--zl-space-sm, 8px) var(--zl-space-md, 16px);
  background: transparent;
  color: var(--zl-brand, #87C8B4);
  border: 1px solid var(--zl-brand, #87C8B4);
  border-radius: var(--zl-radius-md, 12px);
  font-size: var(--zl-font-size-base, 16px);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-home:hover {
  opacity: 0.9;
}
</style>
