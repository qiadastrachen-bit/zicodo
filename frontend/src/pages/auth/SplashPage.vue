<script setup>
/**
 * SplashPage.vue - 开屏动画页
 * 动画结束后：已登录 → 首页；未登录 → 登录注册一体页 /auth
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { STORAGE_KEYS } from '@/config/constants'

const router = useRouter()

onMounted(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/splash/ziling-splash.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = '/splash/ziling-splash.js'
  script.onload = () => {
    const splashEl = document.getElementById('zilingSplash')
    if (splashEl) {
      splashEl.addEventListener('zilingSplashFinished', () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
        router.replace(token ? '/home' : '/auth')
      })
    } else {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      router.replace(token ? '/home' : '/auth')
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
