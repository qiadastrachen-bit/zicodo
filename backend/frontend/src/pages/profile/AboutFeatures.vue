<script setup>
import { useRouter } from 'vue-router'
import { Home, Calendar, CheckSquare, Gamepad2, Users, User, Bell } from 'lucide-vue-next'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'

const router = useRouter()

const features = [
  { icon: Home, title: '首页', description: '宠物养成+AI对话' },
  { icon: Calendar, title: '日历', description: '日程管理与查看' },
  { icon: CheckSquare, title: '任务', description: '分类任务管理' },
  { icon: Gamepad2, title: '互动', description: '游戏化学习互动' },
  { icon: Users, title: '团队', description: '团队协作与邀请' },
  { icon: User, title: '个人', description: '账户与管理' }
]
</script>

<template>
  <div class="about-features-page">
    <ZlTopBar title="功能介绍" @back="router.back()" />

    <div class="features-content">
      <ZlCard class="features-card">
        <h2 class="features-title">功能介绍</h2>
        <div class="features-list">
          <ZlListItem
            v-for="(feature, index) in features"
            :key="index"
            :icon="feature.icon"
            :title="feature.title"
            :subtitle="feature.description"
          />
        </div>
      </ZlCard>

      <!-- 闹钟功能说明 -->
      <ZlCard class="notice-card">
        <div class="notice-header">
          <Bell class="notice-icon" />
          <span class="notice-title">闹钟功能</span>
        </div>
        <div class="notice-content">
          <p class="notice-text">V0.0.0 暂不支持后台闹钟推送，V0.1.0 接入 PWA Notification API</p>
        </div>
      </ZlCard>
    </div>
  </div>
</template>

<style scoped>
.about-features-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.features-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.features-card {
  padding: var(--zl-space-lg);
}

.features-title {
  font-size: var(--zl-font-lg);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0 0 var(--zl-space-lg) 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-sm);
}

/* 闹钟说明卡片 */
.notice-card {
  padding: var(--zl-space-lg);
  background: var(--zl-bg-warm);
  border: 1px solid var(--zl-brand-light);
}

.notice-header {
  display: flex;
  align-items: center;
  gap: var(--zl-space-2);
  margin-bottom: var(--zl-space-md);
}

.notice-icon {
  color: var(--zl-brand);
  width: 20px;
  height: 20px;
}

.notice-title {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
}

.notice-content {
  padding-left: calc(20px + var(--zl-space-2));
}

.notice-text {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
  margin: 0;
  line-height: var(--zl-line-normal);
}
</style>
