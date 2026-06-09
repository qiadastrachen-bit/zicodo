<script setup>
/**
 * ZlListItem.vue - 通用列表项组件
 * Props: { title, subtitle, desc, avatar, icon, arrow, disabled, clickable }
 * Slots: default (右侧内容), title, subtitle, avatar, icon
 * Events: click
 */
import { computed } from 'vue'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object, Function],
    default: null
  },
  arrow: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium', // 'small' | 'medium' | 'large'
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  }
})

const emit = defineEmits(['click'])

// 列表项样式计算
const listItemClass = computed(() => [
  'zl-list-item',
  `zl-list-item--${props.size}`,
  {
    'zl-list-item--clickable': props.clickable || props.arrow,
    'zl-list-item--disabled': props.disabled
  }
])

// 点击处理
const handleClick = (event) => {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <div
    :class="listItemClass"
    @click="handleClick"
  >
    <!-- 左侧图标（可选） -->
    <div v-if="icon || $slots.icon" class="zl-list-item__icon">
      <slot name="icon">
        <ZlIcon
          v-if="icon"
          :name="icon"
          :size="size === 'small' ? 16 : size === 'large' ? 24 : 20"
          color="var(--zl-text-secondary)"
        />
      </slot>
    </div>

    <!-- 头像（可选） -->
    <div v-if="avatar || $slots.avatar" class="zl-list-item__avatar">
      <slot name="avatar">
        <img
          v-if="avatar"
          :src="avatar"
          alt="avatar"
          class="zl-list-item__avatar-img"
        />
      </slot>
    </div>

    <!-- 中间内容区 -->
    <div class="zl-list-item__content">
      <div v-if="title || $slots.title" class="zl-list-item__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="subtitle || $slots.subtitle" class="zl-list-item__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
      <div v-if="desc || $slots.desc" class="zl-list-item__desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>

    <!-- 右侧内容（默认 slot） -->
    <div class="zl-list-item__extra">
      <slot />
    </div>

    <!-- 箭头（可选） -->
    <div v-if="arrow" class="zl-list-item__arrow">
      <ZlIcon name="ChevronRight" :size="16" color="var(--zl-text-hint)" />
    </div>
  </div>
</template>

<style scoped>
.zl-list-item {
  display: flex;
  align-items: center;
  gap: var(--zl-space-md);
  padding: var(--zl-space-md) var(--zl-space-lg);
  background: var(--zl-bg);
  border-bottom: 1px solid var(--zl-border);
  transition: background var(--zl-transition-fast);
  min-height: 44px; /* 确保可点击区域 */
}

/* 尺寸 */
.zl-list-item--small {
  padding: var(--zl-space-sm) var(--zl-space-md);
  min-height: 40px;
}

.zl-list-item--large {
  padding: var(--zl-space-lg) var(--zl-space-lg);
  min-height: 56px;
}

/* 可点击状态 */
.zl-list-item--clickable {
  cursor: pointer;
}

.zl-list-item--clickable:active {
  background: var(--zl-bg-cool);
}

/* 禁用状态 */
.zl-list-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 左侧图标 */
.zl-list-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  color: var(--zl-text-secondary);
}

/* 头像 */
.zl-list-item__avatar {
  flex-shrink: 0;
}

.zl-list-item__avatar-img {
  width: 40px;
  height: 40px;
  border-radius: var(--zl-radius-full);
  object-fit: cover;
}

/* 中间内容区 */
.zl-list-item__content {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.zl-list-item__title {
  font-size: var(--zl-font-base);
  font-weight: var(--zl-weight-medium);
  color: var(--zl-text-primary);
  line-height: var(--zl-line-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zl-list-item__subtitle {
  font-size: var(--zl-font-sm);
  color: var(--zl-text-secondary);
  line-height: var(--zl-line-normal);
  margin-top: var(--zl-space-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zl-list-item__desc {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
  line-height: var(--zl-line-normal);
  margin-top: var(--zl-space-xs);
}

/* 右侧内容 */
.zl-list-item__extra {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--zl-space-sm);
}

/* 箭头 */
.zl-list-item__arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: var(--zl-space-sm);
}
</style>
