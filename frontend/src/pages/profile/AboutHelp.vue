<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

import ZlTopBar from '@/components/common/ZlTopBar.vue'
import ZlIcon from '@/components/common/ZlIcon.vue'
import ZlCard from '@/components/common/ZlCard.vue'
import ZlListItem from '@/components/common/ZlListItem.vue'
import ZlInput from '@/components/common/ZlInput.vue'
import ZlButton from '@/components/common/ZlButton.vue'
import ZlToast from '@/components/common/ZlToast.vue'

const router = useRouter()

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const faqs = [
  { question: '如何创建任务？', answer: '在+页面选择任务类型、填写信息、点击保存，任务会自动同步到日历' },
  { question: '如何加入团队？', answer: '在团队页面输入六位数字邀请码即可加入' },
  { question: '如何更换头像？', answer: 'V0.1.0 开放' },
  { question: '数据会丢失吗？', answer: '所有数据存储在本地浏览器，清除缓存会导致数据丢失（请在设置中清除缓存前确认）' }
]

const expandedIndex = ref(null)

const feedbackContent = ref('')
const feedbackContact = ref('')

const toggleFaq = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const handleSubmitFeedback = async () => {
  if (!feedbackContent.value.trim()) {
    toastMessage.value = '请填写反馈内容'
    toastType.value = 'error'
    showToast.value = true
    return
  }
  try {
    await request.post('/feedback', {
      content: feedbackContent.value,
      contact: feedbackContact.value
    })
    toastMessage.value = '感谢反馈'
    toastType.value = 'success'
    showToast.value = true
    feedbackContent.value = ''
    feedbackContact.value = ''
  } catch (err) {
    toastMessage.value = err?.message || '提交失败，请稍后重试'
    toastType.value = 'error'
    showToast.value = true
  }
}
</script>

<template>
  <div class="about-help-page">
    <ZlTopBar title="帮助与反馈" @back="router.back()" />

    <div class="help-content">
      <ZlCard class="help-section">
        <div class="section-header">
          <ZlIcon name="ClipboardList" :size="20" color="var(--zl-brand)" />
          <h3 class="section-title">常见问题（FAQ）</h3>
        </div>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
            @click="toggleFaq(index)"
          >
            <div class="faq-question">
              {{ faq.question }}
              <span class="faq-toggle">{{ expandedIndex === index ? '−' : '+' }}</span>
            </div>
            <div v-if="expandedIndex === index" class="faq-answer">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </ZlCard>

      <ZlCard class="help-section">
        <div class="section-header">
          <ZlIcon name="MessageCircle" :size="20" color="var(--zl-brand)" />
          <h3 class="section-title">意见反馈</h3>
        </div>
        <div class="feedback-form">
          <ZlInput
            v-model="feedbackContent"
            type="textarea"
            placeholder="请输入您的反馈内容"
            class="feedback-textarea"
          />
          <ZlInput
            v-model="feedbackContact"
            placeholder="联系方式（选填）"
            class="feedback-input"
          />
          <ZlButton
            type="primary"
            size="lg"
            @click="handleSubmitFeedback"
            class="feedback-btn"
          >
            提交反馈
          </ZlButton>
        </div>
      </ZlCard>
    </div>

    <ZlToast
      :visible="showToast"
      :message="toastMessage"
      :type="toastType"
      @update:visible="showToast = $event"
    />
  </div>
</template>

<style scoped>
.about-help-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--zl-bg);
}

.help-content {
  flex: 1;
  padding: var(--zl-space-lg) var(--zl-space-md);
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-lg);
}

.help-section {
  padding: var(--zl-space-lg);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  margin-bottom: var(--zl-space-lg);
}

.section-title {
  font-size: var(--zl-font-base);
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.faq-item {
  border: 1px solid var(--zl-border-light);
  border-radius: var(--zl-radius-md);
  padding: var(--zl-space-md);
  cursor: pointer;
  transition: border-color var(--zl-transition-fast);
}

.faq-item:hover {
  border-color: var(--zl-primary);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--zl-font-sm);
  font-weight: 500;
  color: var(--zl-text-primary);
}

.faq-toggle {
  font-size: var(--zl-font-lg);
  color: var(--zl-text-hint);
  font-weight: 300;
}

.faq-answer {
  margin-top: var(--zl-space-sm);
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  line-height: 1.6;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: var(--zl-space-md);
}

.feedback-textarea {
  min-height: 120px;
}

.feedback-btn {
  margin-top: var(--zl-space-sm);
  width: 100%;
}
</style>
