<script setup>
/**
 * ZlModal.vue - 通用弹窗组件
 * Props: { visible, title, type, closable, maskClosable, confirmText, cancelText, showFooter }
 * Slots: header, default (body), footer
 * Events: update:visible, confirm, cancel
 */
import { computed, watch } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'center', // 'center' | 'bottom'
    validator: (val) => ['center', 'bottom'].includes(val)
  },
  closable: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

// 关闭弹窗
const close = (type = 'cancel') => {
  emit('update:visible', false)
  if (type === 'confirm') {
    emit('confirm')
  } else {
    emit('cancel')
  }
}

// 点击遮罩层
const handleMaskClick = () => {
  if (props.maskClosable) {
    close('cancel')
  }
}

// 阻止冒泡
const stopPropagation = (e) => {
  e.stopPropagation()
}

// 监听 visible 变化，控制 body 滚动
watch(() => props.visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <transition name="zl-modal-fade">
      <div v-if="visible" class="zl-modal__mask" @click="handleMaskClick">
        <div
          class="zl-modal"
          :class="[`zl-modal--${type}`]"
          @click="stopPropagation"
        >
          <!-- 头部 -->
          <div class="zl-modal__header" v-if="title || closable">
            <slot name="header">
              <span class="zl-modal__title">{{ title }}</span>
              <button
                v-if="closable"
                class="zl-modal__close"
                @click="close('cancel')"
              >
                <ZlIcon name="X" :size="20" />
              </button>
            </slot>
          </div>

          <!-- 内容区 -->
          <div class="zl-modal__body">
            <slot />
          </div>

          <!-- 底部 -->
          <div class="zl-modal__footer" v-if="showFooter || $slots.footer">
            <slot name="footer">
              <button class="zl-modal__btn zl-modal__btn--cancel" @click="close('cancel')">
                {{ cancelText }}
              </button>
              <button class="zl-modal__btn zl-modal__btn--confirm" @click="close('confirm')">
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.zl-modal__mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--zl-space-md);
}

/* 居中弹窗 */
.zl-modal--center {
  width: 90%;
  max-width: 400px;
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg);
  box-shadow: var(--zl-shadow-xl);
  padding: var(--zl-space-lg);
  animation: zl-modal-slide-center 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 底部弹窗 */
.zl-modal--bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--zl-bg);
  border-radius: var(--zl-radius-lg) var(--zl-radius-lg) 0 0;
  box-shadow: var(--zl-shadow-lg);
  padding: var(--zl-space-lg);
  max-height: 80vh;
  overflow-y: auto;
  animation: zl-modal-slide-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 头部 */
.zl-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zl-space-md);
}

.zl-modal__title {
  font-size: var(--zl-font-lg);
  font-weight: var(--zl-weight-semibold);
  color: var(--zl-text-primary);
}

.zl-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--zl-radius-full);
  cursor: pointer;
  color: var(--zl-text-hint);
  transition: all var(--zl-transition-fast);
}

.zl-modal__close:hover {
  background: var(--zl-bg-cool);
  color: var(--zl-text-primary);
}

/* 内容区 */
.zl-modal__body {
  margin-bottom: var(--zl-space-lg);
  color: var(--zl-text-secondary);
  line-height: var(--zl-line-normal);
}

/* 底部 */
.zl-modal__footer {
  display: flex;
  gap: var(--zl-space-sm);
  justify-content: flex-end;
}

.zl-modal__btn {
  padding: var(--zl-space-sm) var(--zl-space-lg);
  border: none;
  border-radius: var(--zl-radius-md);
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  cursor: pointer;
  transition: all var(--zl-transition-fast);
}

.zl-modal__btn--cancel {
  background: var(--zl-bg-cool);
  color: var(--zl-text-secondary);
}

.zl-modal__btn--cancel:hover {
  background: var(--zl-border);
}

.zl-modal__btn--confirm {
  background: var(--zl-brand);
  color: white;
}

.zl-modal__btn--confirm:hover {
  background: var(--zl-brand-dark);
}

/* 动画 */
.zl-modal-fade-enter-active,
.zl-modal-fade-leave-active {
  transition: opacity var(--zl-transition-normal);
}

.zl-modal-fade-enter-from,
.zl-modal-fade-leave-to {
  opacity: 0;
}

@keyframes zl-modal-slide-center {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes zl-modal-slide-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
