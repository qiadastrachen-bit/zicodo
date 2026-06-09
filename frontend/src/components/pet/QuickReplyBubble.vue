<script setup>
/**
 * QuickReplyBubble.vue - 快速回复气泡组件
 * 显示zicodo的简洁回复（≤20字）
 * Props: { text: String }
 */
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '你好呀～我是zicodo！有什么想聊的吗？'
  }
})

// 气泡样式计算
const bubbleStyle = computed(() => ({
  maxWidth: '90%'
}))
</script>

<template>
  <div class="quick-reply-bubble" :style="bubbleStyle">
    <div class="bubble-content">
      <p class="reply-text">{{ text }}</p>
    </div>
    <!-- 小三角 -->
    <div class="bubble-tail"></div>
  </div>
</template>

<style scoped>
.quick-reply-bubble {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-bottom: var(--zl-space-md);
  animation: bubble-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes bubble-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble-content {
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-lg);
  padding: var(--zl-space-md) var(--zl-space-xl);
  box-shadow: var(--zl-shadow-sm);
  max-width: 90%;
}

.reply-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  line-height: 1.6;
  margin: 0;
}

.bubble-tail {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--zl-bg-cool);
  margin-left: var(--zl-space-lg);
  margin-top: -1px;
}
</style>
