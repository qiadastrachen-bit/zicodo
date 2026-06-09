<template>
  <div class="empty-state">
    <!-- 图标区域 -->
    <div v-if="$slots.icon || icon" class="empty-icon">
      <slot name="icon">
        <img :src="iconSrc" alt="empty" class="empty-image" v-if="iconSrc" />
      </slot>
    </div>
    
    <!-- 文本区域 -->
    <div class="empty-text-wrapper">
      <p class="empty-message">{{ message }}</p>
      <p v-if="description" class="empty-description">{{ description }}</p>
    </div>
    
    <!-- 操作按钮 -->
    <div v-if="$slots.action || actionText" class="empty-action">
      <slot name="action">
        <ZlButton v-if="actionText" type="outline" @click="$emit('action')">
          {{ actionText }}
        </ZlButton>
      </slot>
    </div>
  </div>
</template>

<script setup>
import ZlButton from './ZlButton.vue'

const props = defineProps({
  message: { type: String, default: '暂无数据' },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' },
  icon: { type: String, default: '' }
})

const emit = defineEmits(['action'])

// 默认图标路径
const iconSrc = props.icon || '/logo/loading.png'
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zl-space-xl) var(--zl-space-lg);
  min-height: 300px;
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--zl-space-lg);
  opacity: 0.6;
}

.empty-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.empty-text-wrapper {
  margin-bottom: var(--zl-space-lg);
}

.empty-message {
  font-size: var(--zl-font-lg);
  color: var(--zl-text-primary);
  font-weight: var(--zl-weight-medium);
  margin: 0 0 var(--zl-space-sm) 0;
}

.empty-description {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-hint);
  margin: 0;
}

.empty-action {
  margin-top: var(--zl-space-md);
}
</style>
