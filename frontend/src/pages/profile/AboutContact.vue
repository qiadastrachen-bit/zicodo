<script setup>
import { useRouter } from 'vue-router'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const router = useRouter()
</script>

<template>
  <div class="about-contact-page">
    <ZlTopBar title="联系我们" @back="router.back()" />

    <div class="contact-content">
      <ZlCard class="contact-card">
        <div class="contact-item">
          <ZlIcon name="Mail" :size="24" color="var(--zl-brand)" />
          <div class="contact-label">联系邮箱</div>
          <div class="contact-placeholder">待配置</div>
        </div>

        <div class="contact-divider" />

        <div class="contact-item">
          <ZlIcon name="Smartphone" :size="24" color="var(--zl-brand)" />
          <div class="contact-label">测试群聊</div>
          <div class="qr-placeholder">待配置</div>
        </div>

        <div class="contact-divider" />

        <div class="contact-item">
          <ZlIcon name="MessageCircle" :size="24" color="var(--zl-brand)" />
          <div class="contact-label">团队负责人</div>
          <div class="qr-placeholder">待配置</div>
        </div>
      </ZlCard>
    </div>
  </div>
</template>

<style scoped>
.about-contact-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.contact-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
}

.contact-card {
  padding: var(--zl-space-xl);
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-lg) 0;
}

.contact-label {
  font-size: var(--zl-font-base);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.contact-placeholder {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  border: 2px dashed var(--zl-border);
  border-radius: var(--zl-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-hint);
  font-size: var(--zl-font-sm);
}

.contact-divider {
  height: 1px;
  background: var(--zl-border);
  margin: 0 calc(-1 * var(--zl-space-xl));
}
</style>
