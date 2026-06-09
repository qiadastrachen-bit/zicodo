<script setup>
/**
 * KaoMojiCarousel.vue - 基于性格的颜文字轮播
 * 根据宠物性格自动选择对应的颜文字池，定时切换显示
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { YANWENZI_BY_CATEGORY } from '@/utils/yanwenzi'

const props = defineProps({
  personality: { type: String, default: 'gentle' },
  interval: { type: Number, default: 3000 }
})

// 性格 → 颜文字池 映射
const personalityPool = {
  gentle: [
    ...YANWENZI_BY_CATEGORY.happy,
    ...YANWENZI_BY_CATEGORY.calm
  ],
  lively: [
    ...YANWENZI_BY_CATEGORY.happy
  ],
  tsundere: [
    ...YANWENZI_BY_CATEGORY.playful,
    ...YANWENZI_BY_CATEGORY.sad
  ],
  calm: [
    ...YANWENZI_BY_CATEGORY.calm,
    ...YANWENZI_BY_CATEGORY.playful
  ]
}

const pool = computed(() => personalityPool[props.personality] || YANWENZI_BY_CATEGORY.happy)
const currentIndex = ref(0)
const displayText = ref('')
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % pool.value.length
  displayText.value = pool.value[currentIndex.value]
}

onMounted(() => {
  displayText.value = pool.value[0]
  if (pool.value.length > 1) {
    timer = setInterval(next, props.interval)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="kaomoji-carousel">
    <Transition name="fade" mode="out-in">
      <span class="kaomoji-text" :key="currentIndex">{{ displayText }}</span>
    </Transition>
  </div>
</template>

<style scoped>
.kaomoji-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  margin-top: var(--zl-space-xs);
}

.kaomoji-text {
  font-size: var(--zl-font-xl);
  color: var(--zl-text-secondary);
  text-align: center;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
