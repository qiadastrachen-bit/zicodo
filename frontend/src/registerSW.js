/**
 * registerSW.js - 注册 Service Worker
 * 处理更新提示和离线状态
 */

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // 有新版本可用，提示用户刷新
    if (confirm('发现新版本，是否立即刷新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('[PWA] 应用已可离线使用')
  },
  onRegisteredSW(swUrl, registration) {
    // 定期检查更新（每 1 小时）
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('[PWA] SW 注册失败:', error)
  }
})
