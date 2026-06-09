<script setup>
/**
 * MegacharDisplay.vue - 大zicodo展示组件
 * 展示 1~4 个汉字，根据字数决定水平/垂直排列
 * Props: { chars: Array, direction: String, duration: Number }
 */
import { computed } from 'vue'

const props = defineProps({
  chars: {
    type: Array,
    default: () => ['字', '灵']
  },
  direction: {
    type: String,
    default: 'auto' // 'auto' | 'horizontal' | 'vertical'
  },
  duration: {
    type: Number,
    default: 3000
  },
  rotateInterval: {
    type: Number,
    default: 0
  }
})

// 自动判断排列方向：≤2字垂直，≥3字水平
const displayDirection = computed(() => {
  if (props.direction !== 'auto') return props.direction
  return props.chars.length <= 2 ? 'vertical' : 'horizontal'
})

// 动画样式
const animationStyle = computed(() => ({
  '--duration': `${props.duration}ms`
}))
</script>

<template>
  <div
    class="megachar-display"
    :class="[`direction-${displayDirection}`]"
    :style="animationStyle"
  >
    <div
      v-for="(char, index) in chars"
      :key="index"
      class="megachar-item"
      :style="{ animationDelay: `${index * 200}ms` }"
    >
      {{ char }}
    </div>
  </div>
</template>

<style scoped>
.megachar-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--zl-space-lg);
  padding: var(--zl-space-xl) var(--zl-space-lg);
  min-height: 140px;
}

/* 垂直排列 */
.direction-vertical {
  flex-direction: column;
}

/* 水平排列 */
.direction-horizontal {
  flex-direction: row;
}

.megachar-item {
  font-family: var(--zl-font-family);
  font-size: calc(var(--zl-font-xxl) * 1.2);
  font-weight: 700;
  color: var(--zl-brand);
  animation: megachar-appear var(--duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
  min-width: 60px;
  text-align: center;
}

@keyframes megachar-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式：小屏幕缩小字号 */
@media (max-width: 375px) {
  .megachar-item {
    font-size: var(--zl-font-xl);
  }
}
</style>
