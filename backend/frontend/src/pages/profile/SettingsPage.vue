<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Trash2, LogOut } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'
import ZlModal from '@/components/common/ZlModal.vue'
import ZlToast from '@/components/common/ZlToast.vue'

const router = useRouter()
const userStore = useUserStore()

const showClearCacheModal = ref(false)
const showLogoutModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const handleNotificationClick = () => {
  router.push('/notifications')
}

const handleClearCacheClick = () => {
  showClearCacheModal.value = true
}

const handleLogoutClick = () => {
  showLogoutModal.value = true
}

const handleClearCacheConfirm = () => {
  // 清除所有数据
  localStorage.clear()
  
  showClearCacheModal.value = false
  toastMessage.value = '缓存已清除'
  toastType.value = 'success'
  showToast.value = true
  
  // 稍作延迟后刷新页面
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

const handleLogoutConfirm = () => {
  showLogoutModal.value = false
  userStore.logout()
  router.replace('/splash')
}
</script>

<template>
  <div class="settings-page">
    <ZlTopBar title="设置" @back="router.back()" />

    <div class="settings-content">
      <ZlCard class="settings-card">
        <ZlListItem
          :icon="Bell"
          title="通知提醒"
          :arrow="true"
          @click="handleNotificationClick"
        />
        <ZlListItem
          :icon="Trash2"
          title="清除缓存"
          :arrow="true"
          @click="handleClearCacheClick"
        />
        <ZlListItem
          :icon="LogOut"
          title="退出登录"
          :arrow="true"
          @click="handleLogoutClick"
        />
      </ZlCard>

      <div class="version-wrapper">
        <!-- 【接口位】接入 GET /api/version 获取最新版本号，目前硬编码 V0.0.0 -->
        <p class="version-text">zicodo V0.0.0</p>
      </div>
    </div>

    <ZlModal
      v-model:visible="showClearCacheModal"
      title="确认清除"
      confirm-text="确定清除"
      cancel-text="取消"
      @confirm="handleClearCacheConfirm"
    >
      确定要清除缓存吗？这将清除所有本地数据。
    </ZlModal>

    <ZlModal
      v-model:visible="showLogoutModal"
      title="确认退出"
      confirm-text="确定退出"
      cancel-text="取消"
      @confirm="handleLogoutConfirm"
    >
      确定要退出登录吗？
    </ZlModal>

    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.settings-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.settings-card {
  padding: 0;
}

.version-wrapper {
  text-align: center;
  padding-top: var(--zl-space-md);
}

.version-text {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  margin: 0;
}
</style>
