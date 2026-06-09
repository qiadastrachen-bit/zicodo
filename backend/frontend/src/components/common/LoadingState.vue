<template>
  <div class="loading-state">
    <img src="/logo/loading.png" alt="加载中" class="loading-img" />
    <p class="loading-text">{{ currentMessage }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: { 
    type: Array, 
    default: () => ['加载中...']  // ← 支持多个文案
  },
  interval: { 
    type: Number, 
    default: 3000  // ← 轮播间隔（毫秒）
  }
})

import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
const currentMessage = computed(() => props.messages[currentIndex.value])

let timer = null

onMounted(() => {
  if (props.messages.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.messages.length
    }, props.interval)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-xxl) var(--zl-space-md);
  min-height: 200px;
}

.loading-img {
  width: 180px;
  height: auto;
  margin-bottom: var(--zl-space-lg);
}

.loading-text {
  font-size: var(--zl-font-base);
  color: var(--zl-text-hint);
}
</style>
