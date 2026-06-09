<script setup>
/**
 * LoginPage.vue - 登录页
 * 昵称+密码登录，调用 POST /api/auth/login
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ZlButton from '@/components/common/ZlButton.vue'
import ZlInput from '@/components/common/ZlInput.vue'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// 处理登录
const handleLogin = async () => {
  if (!username.value.trim()) {
    errorMessage.value = '请输入昵称'
    return
  }
  if (!password.value) {
    errorMessage.value = '请输入密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await userStore.login(username.value.trim(), password.value)
    router.push('/home')
  } catch (error) {
    console.error('[Login] 登录失败', error)
    errorMessage.value = error.message || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <!-- 昵称输入 -->
    <div class="form-item">
      <ZlInput
        v-model="username"
        type="text"
        placeholder="昵称"
        :disabled="isLoading"
      />
    </div>

    <!-- 密码输入 -->
    <div class="form-item">
      <ZlInput
        v-model="password"
        type="password"
        placeholder="密码"
        :disabled="isLoading"
        @keyup.enter="handleLogin"
      />
    </div>

    <!-- 错误信息 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- 登录按钮 -->
    <div class="form-item">
      <ZlButton
        type="primary"
        block
        :loading="isLoading"
        @click="handleLogin"
      >
        登录
      </ZlButton>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
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
</style>
