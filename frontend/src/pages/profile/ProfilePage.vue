<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Palette, Sparkles, Settings, HelpCircle, Cat, Users } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'
import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const userStore = useUserStore()

const userDisplayName = computed(() => userStore.displayName)

/* 退出登录功能已移除 (2026-06-08) - 用户要求移除 */
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar-wrapper">
        <!-- 【接口位】上传头像：调用 PUT /api/users/me/avatar，后端未建，目前使用 default-avatar.png 作为固定默认头像 -->
        <img
          :src="defaultAvatar"
          class="profile-avatar"
          alt="头像"
        />
      </div>
      <h1 class="profile-name">{{ userDisplayName }}</h1>
      <p class="profile-status">o(*￣▽￣*)ブ</p>
    </div>

    <ZlCard class="profile-menu-card">
      <ZlListItem
        title="账户信息"
        :arrow="true"
        @click="router.push('/profile/edit')"
      >
        <template #icon>
          <User :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="主题"
        :arrow="true"
        @click="router.push('/profile/theme')"
      >
        <template #icon>
          <Palette :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="积分充值"
        :arrow="true"
        @click="router.push('/profile/points')"
      >
        <template #icon>
          <Sparkles :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="设置"
        :arrow="true"
        @click="router.push('/profile/settings')"
      >
        <template #icon>
          <Settings :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="团队"
        :arrow="true"
        @click="router.push('/teams')"
      >
        <template #icon>
          <Users :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="宠物设置"
        :arrow="true"
        @click="router.push('/profile/pet-settings')"
      >
        <template #icon>
          <Cat :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
      <ZlListItem
        title="关于 zicodo"
        :arrow="true"
        @click="router.push('/profile/about')"
      >
        <template #icon>
          <HelpCircle :size="20" color="var(--zl-text-secondary)" />
        </template>
      </ZlListItem>
    </ZlCard>

    <!-- 退出登录按钮和弹窗已移除 (2026-06-08) - 用户要求移除 -->
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  padding: var(--zl-space-xl) var(--zl-space-md);
  gap: var(--zl-space-lg);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
  padding-top: var(--zl-space-md);
}

.profile-avatar-wrapper {
  margin-bottom: var(--zl-space-md);
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: var(--zl-radius-full);
  object-fit: cover;
}

.profile-name {
  margin: 0;
  font-size: var(--zl-font-xl);
  font-weight: 600;
  color: var(--zl-text-primary);
}

.profile-status {
  margin: 0;
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.profile-menu-card {
  padding: 0;
}

/* 退出登录按钮样式已移除 (2026-06-08) - 对应元素已删除 */
</style>
