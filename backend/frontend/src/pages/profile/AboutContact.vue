<script setup>
import { useRouter } from 'vue-router'
import { Mail, Smartphone, MessageCircle } from 'lucide-vue-next'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlCard from '@/components/common/ZlCard.vue'

const router = useRouter()
</script>

<template>
  <div class="about-contact-page">
    <ZlTopBar title="联系我们" @back="router.back()" />

    <div class="contact-content">
      <ZlCard class="contact-card">
        <div class="contact-item">
          <Mail class="contact-icon" size="24" />
          <div class="contact-label">联系邮箱</div>
          <!-- 【接口位】填入客服邮箱，从 config/constants.js 读取 CONTACT_EMAIL，目前留空 -->
          <div class="contact-placeholder">待配置</div>
        </div>

        <div class="contact-divider" />

        <div class="contact-item">
          <Smartphone class="contact-icon" size="24" />
          <div class="contact-label">测试群聊</div>
          <!-- 【接口位】上传二维码图片到 public/contact/，云服务器部署后统一配置 -->
          <div class="qr-placeholder">待配置</div>
        </div>

        <div class="contact-divider" />

        <div class="contact-item">
          <MessageCircle class="contact-icon" size="24" />
          <div class="contact-label">团队负责人</div>
          <!-- 【接口位】上传二维码图片到 public/contact/，云服务器部署后统一配置 -->
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

.contact-icon {
  color: var(--zl-primary);
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
  background: var(--zl-border-light);
  margin: 0 calc(-1 * var(--zl-space-xl));
}
</style>
