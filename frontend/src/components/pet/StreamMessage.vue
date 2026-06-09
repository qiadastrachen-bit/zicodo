<script setup>
/**
 * StreamMessage.vue - 流式消息展示组件
 * 逐段显示zicodo的回复（3~5段话）
 * Props: { messages: Array<{ text, emoji, word? }> }
 */
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  }
})

// 当前显示到第几段
const currentIndex = ref(-1)
const displayedMessages = ref([])

// 逐段显示消息
const playMessages = () => {
  if (!props.messages.length) return

  currentIndex.value = -1
  displayedMessages.value = []

  if (props.autoPlay) {
    let index = 0
    const interval = setInterval(() => {
      if (index >= props.messages.length) {
        clearInterval(interval)
        return
      }

      displayedMessages.value.push(props.messages[index])
      currentIndex.value = index
      index++
    }, 800) // 每段间隔 800ms
  }
}

// 监听 messages 变化
watch(() => props.messages, (newVal) => {
  if (newVal.length) {
    playMessages()
  }
}, { deep: true })

onMounted(() => {
  if (props.messages.length) {
    playMessages()
  }
})

// 手动触发下一段
const showNext = () => {
  if (currentIndex.value < props.messages.length - 1) {
    currentIndex.value++
    displayedMessages.value.push(props.messages[currentIndex.value])
  }
}
</script>

<template>
  <div class="stream-message-container">
    <div
      v-for="(msg, index) in displayedMessages"
      :key="index"
      class="message-segment"
      :class="{ active: index === currentIndex }"
    >
      <!-- 文字内容 -->
      <p class="segment-text">{{ msg.text }}</p>

      <!-- 表情 -->
      <span v-if="msg.emoji" class="segment-emoji">{{ msg.emoji }}</span>

      <!-- 展示词（可选） -->
      <span v-if="msg.word" class="segment-word">{{ msg.word }}</span>
    </div>

    <!-- 手动触发按钮（可选） -->
    <button
      v-if="!autoPlay || currentIndex < messages.length - 1"
      class="next-btn"
      @click="showNext"
    >
      继续
    </button>
  </div>
</template>

<style scoped>
.stream-message-container {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
  padding: var(--zl-space-lg) 0;
  max-width: 100%;
}

.message-segment {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-sm) var(--zl-space-md);
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-md);
  opacity: 0;
  transform: translateY(10px);
  animation: segment-appear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes segment-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.segment-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-primary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.segment-emoji {
  font-size: var(--zl-font-lg);
  flex-shrink: 0;
}

.segment-word {
  font-size: var(--zl-font-sm);
  color: var(--zl-brand);
  font-weight: 500;
  background: var(--zl-bg-warm);
  padding: var(--zl-space-xs) var(--zl-space-sm);
  border-radius: var(--zl-radius-sm);
  flex-shrink: 0;
}

.next-btn {
  align-self: flex-end;
  background: var(--zl-brand);
  color: #FFFFFF;
  border: none;
  border-radius: var(--zl-radius-md);
  padding: var(--zl-space-sm) var(--zl-space-lg);
  font-size: var(--zl-font-sm);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.next-btn:hover {
  background: var(--zl-brand-dark);
  transform: scale(1.05);
}

.next-btn:active {
  transform: scale(0.95);
}
</style>
