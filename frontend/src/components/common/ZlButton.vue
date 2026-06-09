<script setup>
/**
 * ZlButton.vue - 通用按钮组件
 * Props: { type, size, block, loading, disabled }
 */
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary', // 'primary' | 'secondary' | 'outline' | 'text'
    validator: (val) => ['primary', 'secondary', 'outline', 'text'].includes(val)
  },
  size: {
    type: String,
    default: 'medium', // 'small' | 'medium' | 'large'
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  block: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// 按钮样式计算
const buttonClass = computed(() => [
  'zl-button',
  `zl-button--${props.type}`,
  `zl-button--${props.size}`,
  {
    'zl-button--block': props.block,
    'zl-button--loading': props.loading,
    'zl-button--disabled': props.disabled
  }
])

// 处理点击
const handleClick = (event) => {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载动画 -->
    <span v-if="loading" class="zl-button__loading"></span>

    <!-- 按钮内容 -->
    <span v-else class="zl-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.zl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-sm);
  border: none;
  border-radius: var(--zl-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--zl-transition-fast);
  outline: none;
  position: relative;
  overflow: hidden;
}

/* 尺寸 */
.zl-button--small {
  padding: var(--zl-space-sm) var(--zl-space-lg);
  font-size: var(--zl-font-sm);
  min-height: 40px;
}

.zl-button--medium {
  padding: var(--zl-space-md) var(--zl-space-xl);
  font-size: var(--zl-font-md);
  min-height: 48px;
}

.zl-button--large {
  padding: var(--zl-space-lg) var(--zl-space-xxl);
  font-size: var(--zl-font-lg);
  min-height: 56px;
}

/* 类型：主要按钮 */
.zl-button--primary {
  background: var(--zl-brand);
  color: #FFFFFF;
}

.zl-button--primary:hover:not(:disabled) {
  background: var(--zl-brand-dark);
  transform: scale(1.02);
}

/* 类型：次要按钮 */
.zl-button--secondary {
  background: var(--zl-bg-cool);
  color: var(--zl-text-primary);
}

.zl-button--secondary:hover:not(:disabled) {
  background: var(--zl-border);
}

/* 类型：描边按钮 */
.zl-button--outline {
  background: transparent;
  color: var(--zl-brand);
  border: 1px solid var(--zl-brand);
}

.zl-button--outline:hover:not(:disabled) {
  background: rgba(135, 200, 180, 0.1);
}

/* 类型：文本按钮 */
.zl-button--text {
  background: transparent;
  color: var(--zl-brand);
  padding-left: var(--zl-space-xs);
  padding-right: var(--zl-space-xs);
}

.zl-button--text:hover:not(:disabled) {
  background: rgba(135, 200, 180, 0.1);
}

/* Block 模式 */
.zl-button--block {
  display: flex;
  width: 100%;
}

/* 禁用状态 */
.zl-button--disabled,
.zl-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 加载状态 */
.zl-button--loading {
  cursor: not-allowed;
}

.zl-button__loading {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: zl-button-spin 0.8s linear infinite;
}

@keyframes zl-button-spin {
  to {
    transform: rotate(360deg);
  }
}

.zl-button__content {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
}
</style>
