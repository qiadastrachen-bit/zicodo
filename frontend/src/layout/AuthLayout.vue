<script setup>
/**
 * AuthLayout.vue - 认证页布局
 * 用于登录、注册等认证页面，带 logo 和标题
 */
</script>

<template>
  <div class="auth-layout">
    <!-- 顶部 Logo 区域 -->
    <div class="auth-header">
      <img src="@/assets/logo_clear.png" alt="zicodo" class="auth-logo" />
      <h1 class="auth-title">zicodo</h1>
      <p class="auth-subtitle">你的数字汉字精灵</p>
    </div>

    <!-- 内容区域（登录/注册表单） -->
    <div class="auth-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  padding: var(--zl-space-xl) var(--zl-space-lg);
  display: flex;
  flex-direction: column;
  background-color: var(--zl-bg);
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--zl-space-xl);
  margin-top: 10vh;
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin-bottom: var(--zl-space-md);
}

.auth-title {
  font-size: var(--zl-font-xl);
  font-weight: 700;
  color: var(--zl-brand);
  margin-bottom: var(--zl-space-xs);
}

.auth-subtitle {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.auth-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}
</style>
