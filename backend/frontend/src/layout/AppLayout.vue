<script setup>
/**
 * AppLayout.vue - 主应用布局
 * 包含顶部导航栏、内容区域、底部 TabBar
 */
import ZlTabbar from '@/components/common/ZlTabbar.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div class="app-layout">
    <!-- 全局铃铛入口已移除 (2026-06-08) - 用户要求移除 -->

    <!-- 顶部导航栏（可选） -->
    <header v-if="route.meta.showHeader" class="app-header">
      <slot name="header">
        <h1 class="header-title">{{ route.meta.title }}</h1>
      </slot>
    </header>

    <!-- 主内容区（缓存互动页和首页） -->
    <main class="app-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['InteractPage', 'PetHomePage']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <!-- 底部 TabBar（根据路由 meta 决定是否显示） -->
    <ZlTabbar v-if="route.meta.showTabBar" />
  </div>
</template>

<style scoped>
.app-layout {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: var(--zl-bg);
  padding-bottom: var(--zl-tabbar-height);
}

/* 全局铃铛按钮样式已移除 (2026-06-08) - 对应元素已删除 */

.app-header {
  position: sticky;
  top: 0;
  height: var(--zl-header-height);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  padding: 0 var(--zl-space-md);
}

.header-title {
  font-size: var(--zl-font-md);
  font-weight: 700;
  color: var(--zl-text-primary);
}

.app-content {
  min-height: calc(100vh - var(--zl-tabbar-height));
  overflow-y: auto;
}
</style>
