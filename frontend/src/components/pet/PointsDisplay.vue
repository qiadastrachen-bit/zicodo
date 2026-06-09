<script setup>
/**
 * PointsDisplay.vue - 积分展示组件
 * 用于在首页或其他位置显示当前积分余额，点击跳转到积分页面
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles } from 'lucide-vue-next'
import { usePointStore } from '@/stores/point'

const router = useRouter()
const pointStore = usePointStore()

const isLoading = ref(false)

// 跳转到积分页面
const goToPoints = () => {
  router.push('/profile/points')
}

// 初始化加载积分
const loadPoints = async () => {
  try {
    isLoading.value = true
    await pointStore.fetchPoints()
  } catch (error) {
    // 静默失败，使用默认值 0，不影响用户体验
    console.debug('[PointsDisplay] 积分API暂未实现，使用默认值')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPoints()
})
</script>

<template>
  <button class="points-display" @click="goToPoints" title="查看积分">
    <div class="points-icon">
      <Sparkles :size="18" />
    </div>
    <div class="points-info">
      <span class="points-label">积分</span>
      <span v-if="isLoading" class="points-value points-loading">---</span>
      <span v-else class="points-value">{{ pointStore.balance }}</span>
    </div>
  </button>
</template>

<style scoped>
.points-display {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  background: var(--zl-surface);
  border: 1px solid var(--zl-border);
  border-radius: var(--zl-radius-md);
  padding: var(--zl-space-sm) var(--zl-space-md);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
  min-height: 44px;
}

.points-display:hover {
  background: var(--zl-bg-cool);
  border-color: var(--zl-brand);
}

.points-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-brand);
}

.points-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.points-label {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
  line-height: 1;
}

.points-value {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-semibold);
  color: var(--zl-text-primary);
  line-height: 1;
}

.points-loading {
  opacity: 0.6;
}
</style>
