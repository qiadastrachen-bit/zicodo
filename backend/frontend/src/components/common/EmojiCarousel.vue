<script setup>
/**
 * EmojiCarousel.vue - 颜文字/emoji 轮播组件
 * 支持自动轮播和手动切换
 * Props:
 *   - emojis: Array<string> 颜文字数组
 *   - interval: number 轮播间隔（ms），默认 3000
 *   - autoplay: boolean 是否自动轮播，默认 true
 */
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  emojis: {
    type: Array,
    default: () => ['(·∀·)', '(·∇·)', '(·▿·*)', '(◕‿◕)', '(￣▽￣*)']
  },
  interval: {
    type: Number,
    default: 3000
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const currentIndex = ref(0)
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.emojis.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.emojis.length) % props.emojis.length
}

const goTo = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  if (props.autoplay && props.emojis.length > 1) {
    timer = setInterval(next, props.interval)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="emoji-carousel">
    <div class="carousel-track">
      <transition-group name="carousel" tag="div" class="carousel-inner">
        <span
          v-for="(emoji, index) in emojis"
          :key="index"
          v-show="index === currentIndex"
          class="carousel-emoji"
        >
          {{ emoji }}
        </span>
      </transition-group>
    </div>

    <!-- 指示器 -->
    <div v-if="emojis.length > 1" class="carousel-indicators">
      <button
        v-for="(emoji, index) in emojis"
        :key="index"
        class="indicator-dot"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      ></button>
    </div>

    <!-- 手动切换按钮（可选） -->
    <div v-if="emojis.length > 1" class="carousel-controls">
      <button class="control-btn" @click="prev">‹</button>
      <button class="control-btn" @click="next">›</button>
    </div>
  </div>
</template>

<style scoped>
.emoji-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-emoji {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  white-space: nowrap;
}

.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.carousel-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.2);
}

.carousel-indicators {
  display: flex;
  gap: var(--zl-space-sm);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--zl-border);
  cursor: pointer;
  padding: 0;
  transition: all var(--zl-transition-fast);
}

.indicator-dot.active {
  background: var(--zl-brand);
  width: 16px;
  border-radius: 4px;
}

.carousel-controls {
  display: flex;
  gap: var(--zl-space-md);
}

.control-btn {
  background: var(--zl-bg-cool);
  border: 1px solid var(--zl-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-primary);
  transition: all var(--zl-transition-fast);
}

.control-btn:hover {
  background: var(--zl-brand);
  color: #FFFFFF;
  border-color: var(--zl-brand);
}
</style>
