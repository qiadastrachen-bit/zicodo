<template>
  <div class="user-message-bubble">
    <p class="user-message-text">{{ text }}</p>
  </div>
</template>

<script setup>
/**
 * UserMessageBubble.vue - 用户消息气泡组件
 * 显示用户发送的消息，右对齐，品牌色背景
 * Props: { text: String }
 */
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.user-message-bubble {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--zl-space-md);
  animation: bubble-appear 0.3s ease-out;
}

.user-message-text {
  max-width: 75%;
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: var(--zl-brand);
  color: #FFFFFF;
  border-radius: var(--zl-radius-lg) var(--zl-radius-lg) 4px var(--zl-radius-lg);
  font-size: var(--zl-font-base);
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
}

@keyframes bubble-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
