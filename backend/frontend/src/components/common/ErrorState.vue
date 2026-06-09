<template>
  <div class="error-state">
    <img src="/logo/error.png" alt="出错了" class="error-img" />
    <p class="error-text">{{ message }}</p>
    <button class="retry-btn" v-if="showRetry" @click="$emit('retry')">重试</button>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: '出错了，请重试' },
  showRetry: { type: Boolean, default: true }
})

const emit = defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-xxl) var(--zl-space-md);
  min-height: 200px;
}

.error-img {
  width: 180px;
  height: auto;
  margin-bottom: var(--zl-space-lg);
}

.error-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-secondary);
  margin-bottom: var(--zl-space-lg);
}

.retry-btn {
  padding: var(--zl-space-sm) var(--zl-space-xl);
  background: var(--zl-brand);
  color: white;
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  cursor: pointer;
  transition: opacity var(--zl-transition-fast);
}

.retry-btn:hover {
  opacity: 0.9;
}
</style>
