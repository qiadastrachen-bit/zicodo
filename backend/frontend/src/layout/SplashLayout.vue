<script setup>
/**
 * SplshLayout.vue - 启动页布局
 * 用于显示启动页、引导页等全屏页面
 */
</script>

<template>
  <div class="splash-layout">
    <!-- 启动页内容区域 -->
    <div class="splash-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.splash-layout {
  width: 100%;
  height: 100vh;
  background-color: var(--zl-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.splash-content {
  width: 100%;
  max-width: 430px;
  padding: var(--zl-space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
