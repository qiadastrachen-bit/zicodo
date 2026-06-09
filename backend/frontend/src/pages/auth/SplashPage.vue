<script setup>
/**
 * SplashPage.vue - 开屏动画页
 * 加载 ziling-splash 动画，播放完成后自动登录并进入首页
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  // 动态加载 splash CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/splash/ziling-splash.css'
  document.head.appendChild(link)

  // 动态加载 splash JS
  const script = document.createElement('script')
  script.src = '/splash/ziling-splash.js'
  script.onload = () => {
    // JS 加载完成后，监听动画结束事件
    const splashEl = document.getElementById('zilingSplash')
    if (splashEl) {
      splashEl.addEventListener('zilingSplashFinished', async () => {
        // 动画结束，根据token判断跳转目标
        const token = localStorage.getItem('zl_token')
        if (token) {
          // 已登录，跳转到首页
          router.replace('/home')
        } else {
          // 未登录，自动注册并登录，然后进入首页
          try {
            await userStore.autoLogin()
            router.replace('/home')
          } catch (error) {
            console.error('[Splash] 自动登录失败:', error)
            // 即使失败也跳转到首页，路由守卫会再次尝试
            router.replace('/home')
          }
        }
      })
    }
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div class="splash-page">
    <div id="zilingSplash" data-ziling-splash></div>
  </div>
</template>

<style scoped>
.splash-page {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: #FFFAF1;
}
</style>
