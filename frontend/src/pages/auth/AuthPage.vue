<script setup>
/**
 * AuthPage.vue - 注册登录一体页面
 * 首次用户：自动注册并登录
 * 非首次用户：直接登录
 */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ZlButton from '@/components/common/ZlButton.vue'
import ZlInput from '@/components/common/ZlInput.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

function goAfterAuth() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
  router.replace(redirect)
}

const username = ref('')
const password = ref('')
const nickname = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleAuth = async () => {
  if (!username.value.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (!password.value) {
    errorMessage.value = '请输入密码'
    return
  }
  if (password.value.length < 6) {
    errorMessage.value = '密码长度至少6位'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 先尝试登录
    try {
      await userStore.login(username.value.trim(), password.value)
      goAfterAuth()
      return
    } catch {
      // 登录失败 → 首次用户自动注册（老用户密码错误时注册会提示「用户名已被占用」）
      try {
        await userStore.register(username.value.trim(), password.value, nickname.value.trim() || null)
        goAfterAuth()
        return
      } catch (registerError) {
        throw registerError
      }
    }
  } catch (error) {
    console.error('[Auth] 认证失败', error)
    errorMessage.value = error.message || '认证失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <!-- 表单区域 -->
    <div class="auth-form">
      <!-- 用户名输入 -->
      <div class="form-item">
        <ZlInput
          v-model="username"
          type="text"
          placeholder="输入用户名"
          :disabled="isLoading"
        />
      </div>

      <!-- 昵称输入 -->
      <div class="form-item">
        <ZlInput
          v-model="nickname"
          type="text"
          placeholder="输入昵称（选填）"
          :disabled="isLoading"
        />
      </div>

      <!-- 周五（6月13日）开启邮箱验证：取消下一行的注释即可启用 -->
      <!--
      <div class="form-item">
        <ZlInput v-model="email" type="email" placeholder="输入邮箱（必填）" :disabled="isLoading" />
      </div>
      -->

      <!-- 密码输入 -->
      <div class="form-item">
        <ZlInput
          v-model="password"
          type="password"
          placeholder="输入密码"
          :disabled="isLoading"
          @keyup.enter="handleAuth"
        />
        <p class="input-hint">密码长度至少6位</p>
      </div>

      <!-- 错误信息 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- 登录/注册按钮 -->
      <div class="form-item">
        <ZlButton
          type="primary"
          block
          :loading="isLoading"
          @click="handleAuth"
        >
          {{ isLoading ? '验证中...' : '开始使用' }}
        </ZlButton>
      </div>

      <!-- 提示文字 -->
      <p class="auth-hint">
        首次使用自动创建账户，下次登录直接进入
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.form-item {
  display: flex;
  flex-direction: column;
}

.error-message {
  text-align: center;
  color: var(--zl-danger);
  font-size: var(--zl-font-sm);
  padding: var(--zl-space-sm);
  background: rgba(239, 71, 111, 0.1);
  border-radius: var(--zl-radius-sm);
}

.auth-hint {
  text-align: center;
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
  margin: 0;
  padding-top: var(--zl-space-sm);
}

.input-hint {
  font-size: 12px;
  color: #999999;
  margin-top: 6px;
  margin-left: 2px;
}
</style>
