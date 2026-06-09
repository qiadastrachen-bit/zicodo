<script setup>
/**
 * App.vue - 根组件
 * 只提供路由出口，布局由路由配置中的 layout 组件管理
 */
</script>

<template>
  <div id="app" class="page-container">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: var(--zl-bg);
}
</style>
