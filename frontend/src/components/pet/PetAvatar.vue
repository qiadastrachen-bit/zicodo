<script setup>
/**
 * PetAvatar.vue - 宠物头像组件
 * 使用颜文字轮播替代宠物图片，根据性格切换颜文字池
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePetStore } from '@/stores/pet'
import { YANWENZI_BY_CATEGORY } from '@/utils/yanwenzi'

const props = defineProps({
  personality: { type: String, default: 'gentle' },
  interval: { type: Number, default: 3000 }
})

const petStore = usePetStore()

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

// 宠物名称
const petName = computed(() => petStore.petName)
</script>

<template>
  <div class="pet-avatar-container">
    <!-- 颜文字轮播头像 -->
    <div class="pet-avatar">
      <Transition name="fade" mode="out-in">
        <span class="kaomoji-display" :key="currentIndex">{{ displayText }}</span>
      </Transition>
    </div>

    <!-- 宠物名称（可选） -->
    <p v-if="petName" class="pet-name">{{ petName }}</p>
  </div>
</template>

<style scoped>
.pet-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--zl-space-xl) 0;
}

.pet-avatar {
  width: 120px;
  height: 120px;
  border-radius: var(--zl-radius-full);
  background: var(--zl-bg-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--zl-shadow-md);
  overflow: hidden;
  transition: transform var(--zl-transition-base);
}

.pet-avatar:hover {
  transform: scale(1.05);
}

.kaomoji-display {
  font-size: 48px;
  font-weight: var(--zl-weight-bold);
  color: var(--zl-brand);
  text-align: center;
  line-height: 1.2;
}

.pet-name {
  margin-top: var(--zl-space-sm);
  font-size: var(--zl-font-md);
  font-weight: 500;
  color: var(--zl-text-primary);
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
