<script setup>
/**
 * ZlIcon - 统一图标组件
 * 
 * Props:
 * - name: 图标名称 (Lucide 图标名，如 'Sparkles', 'Plus', 'Settings')
 * - size: 尺寸 (default: 20)
 * - color: 颜色 (default: var(--zl-text-secondary))
 * - className: 自定义类名
 * - title: 可选的 title 属性（用于可访问性）
 * 
 * Events:
 * - click: 点击事件
 * 
 * 示例:
 * <ZlIcon name="Sparkles" :size="20" color="var(--zl-brand)" @click="handleClick" />
 * <ZlIcon name="Plus" title="添加" />
 */
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => {
      return value in LucideIcons
    }
  },
  size: {
    type: [Number, String],
    default: 20
  },
  color: {
    type: String,
    default: 'var(--zl-text-secondary)'
  },
  className: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// 获取图标组件
const IconComponent = computed(() => {
  return LucideIcons[props.name] || null
})

// 点击处理
const handleClick = (event) => {
  emit('click', event)
}
</script>

<template>
  <span
    :class="['zl-icon', className]"
    @click="handleClick"
  >
    <component
      v-if="IconComponent"
      :is="IconComponent"
      :size="size"
      :color="color"
      :title="title"
    />
    <span v-else class="zl-icon-fallback">
      ?
    </span>
  </span>
</template>

<style scoped>
.zl-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--zl-transition-fast);
  line-height: 0;
}

.zl-icon:hover {
  opacity: 0.8;
}

.zl-icon:active {
  transform: scale(0.95);
}

.zl-icon-fallback {
  width: var(--size, 20px);
  height: var(--size, 20px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--zl-text-hint);
  font-size: var(--zl-font-sm);
  font-weight: var(--zl-weight-semibold);
  background: var(--zl-bg-cool);
  border-radius: var(--zl-radius-sm);
}
</style>
