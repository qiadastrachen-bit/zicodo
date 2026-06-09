<script setup>
/**
 * ZlToast.vue - 轻提示组件（全局使用）
 * 使用方式：通过 provide/inject 或直接用 Toast 服务
 * Props: { message, type, duration, visible }
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info', // 'info' | 'success' | 'warning' | 'error'
    validator: (val) => ['info', 'success', 'warning', 'error'].includes(val)
  },
  duration: {
    type: Number,
    default: 2000 // 2秒后自动关闭
  },
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'top', // 'top' | 'center' | 'bottom'
    validator: (val) => ['top', 'center', 'bottom'].includes(val)
  }
})

const emit = defineEmits(['update:visible', 'closed'])

// ⚠️ 关键修复：直接用 props.visible 控制 v-if，不再通过 isVisible ref 中转
// isVisible ref 会丢失 props 的响应式（初始值只取一次），导致 visible 变化后不显示
let timer = null

// 图标组件映射（使用组件对象，而不是字符串）
const iconComponents = {
  info: 'Info',
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle'
}

// 图标颜色映射
const getIconColor = (type) => {
  const colorMap = {
    info: 'var(--zl-brand)',
    success: 'var(--zl-success)',
    warning: 'var(--zl-warning)',
    error: 'var(--zl-danger)'
  }
  return colorMap[type] || colorMap.info
}

// 监听 visible 变化
watch(() => props.visible, (val) => {
  if (val) {
    startTimer()
  }
})

// 开始计时器
const startTimer = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    close()
  }, props.duration)
}

// 关闭 Toast
const close = () => {
  emit('update:visible', false)
  emit('closed')
}

// 清除计时器
onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <Teleport to="body">
    <transition name="zl-toast-fade">
      <div
        v-if="visible"
        class="zl-toast"
        :class="[`zl-toast--${type}`, `zl-toast--${position}`]"
      >
        <div class="zl-toast__content">
          <!-- 图标 -->
          <span class="zl-toast__icon" :style="{ color: getIconColor(type) }">
            <ZlIcon
              :name="iconComponents[type]"
              :size="18"
            />
          </span>
          <!-- 文本 -->
          <span class="zl-toast__text">{{ message }}</span>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.zl-toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

/* 位置 */
.zl-toast--top {
  top: var(--zl-space-xl);
}

.zl-toast--center {
  top: 50%;
  transform: translate(-50%, -50%);
}

.zl-toast--bottom {
  bottom: calc(var(--zl-tabbar-height) + var(--zl-space-xl));
}

/* 内容样式 */
.zl-toast__content {
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
  padding: var(--zl-space-md) var(--zl-space-lg);
  background: var(--zl-text-primary);
  color: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  box-shadow: var(--zl-shadow-lg);
  font-size: var(--zl-font-sm);
  max-width: 300px;
  word-break: break-word;
}

/* 类型样式 */
.zl-toast--success .zl-toast__content {
  background: var(--zl-success);
  color: #FFFFFF;
}

.zl-toast--warning .zl-toast__content {
  background: var(--zl-warning);
  color: var(--zl-text-primary);
}

.zl-toast--error .zl-toast__content {
  background: var(--zl-danger);
  color: #FFFFFF;
}

/* 图标 */
.zl-toast__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 文本 */
.zl-toast__text {
  line-height: var(--zl-line-normal);
}

/* 动画 */
.zl-toast-fade-enter-active {
  transition: all var(--zl-transition-normal);
}

.zl-toast-fade-leave-active {
  transition: all var(--zl-transition-fast);
}

.zl-toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.zl-toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.zl-toast--center.zl-toast-fade-enter-from {
  transform: translate(-50%, -50%) scale(0.9);
}

.zl-toast--center.zl-toast-fade-leave-to {
  transform: translate(-50%, -50%) scale(0.9);
}
</style>
