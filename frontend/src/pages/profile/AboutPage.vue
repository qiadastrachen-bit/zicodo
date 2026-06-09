<script setup>
import { useRouter } from 'vue-router'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'
import LoadingState from '@/components/common/LoadingState.vue'

const router = useRouter()
</script>

<template>
  <div class="about-page">
    <ZlTopBar title="关于 zicodo" @back="router.back()" />

    <div class="about-content">
      <LoadingState :messages="['zicodo', '你的数字汉字精灵']" />

      <div class="version-wrapper">
        <p class="version-text">V0.0.0</p>
      </div>

      <ZlCard class="about-menu-card" :padding="0">
        <ZlListItem
          icon="Info"
          title="功能介绍"
          :arrow="true"
          @click="router.push('/profile/about/features')"
        />
        <ZlListItem
          icon="LifeBuoy"
          title="帮助与反馈"
          :arrow="true"
          @click="router.push('/profile/about/help')"
        />
        <ZlListItem
          icon="Mail"
          title="联系我们"
          :arrow="true"
          @click="router.push('/profile/about/contact')"
        />
      </ZlCard>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.about-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
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

.about-menu-card {
  padding: 0;
}
</style>
