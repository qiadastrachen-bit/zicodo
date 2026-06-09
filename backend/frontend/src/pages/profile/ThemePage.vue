<script setup>
import { useRouter } from 'vue-router'
import ZlTopBar from '@/components/common/ZlTopBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
</script>

<template>
  <div class="theme-page">
    <ZlTopBar title="主题设置" @back="router.back()" />

    <div class="theme-content">
      <!-- 【接口位】后续接入 themeStore.setTheme() 切换亮色/暗色/跟随系统，themeStore 已就绪 -->
      <!-- 【接入时机】V0.1.0 开放 -->
      <EmptyState 
        message="主题系统暂未开放" 
        description="敬请期待后续版本"
      />
    </div>
  </div>
</template>

<style scoped>
.theme-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.theme-content {
  flex: 1;
  padding: var(--zl-space-xl) var(--zl-space-md);
}
</style>
