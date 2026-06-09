<script setup>
/**
 * ZlCard.vue - 通用卡片组件
 * Props: { type, shadow, padding, round, hoverable, clickable }
 * Slots: default, header, footer
 */
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // 'default' | 'outline' | 'flat'
    validator: (val) => ['default', 'outline', 'flat'].includes(val)
  },
  shadow: {
    type: String,
    default: 'md', // 'none' | 'sm' | 'md' | 'lg' | 'xl'
    validator: (val) => ['none', 'sm', 'md', 'lg', 'xl'].includes(val)
  },
  padding: {
    type: [String, Number],
    default: 'md' // 'sm' | 'md' | 'lg' | number
  },
  round: {
    type: String,
    default: 'md', // 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    validator: (val) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(val)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// 卡片样式计算
const cardClass = computed(() => [
  'zl-card',
  `zl-card--${props.type}`,
  `zl-card--shadow-${props.shadow}`,
  `zl-card--round-${props.round}`,
  {
    'zl-card--hoverable': props.hoverable,
    'zl-card--clickable': props.clickable
  }
])

// 内边距计算
const cardPadding = computed(() => {
  if (typeof props.padding === 'number') {
    return `${props.padding}px`
  }
  const paddingMap = {
    'sm': 'var(--zl-space-sm)',
    'md': 'var(--zl-space-lg)',
    'lg': 'var(--zl-space-xl)'
  }
  return paddingMap[props.padding] || paddingMap['md']
})

// 点击处理
const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<template>
  <div
    :class="cardClass"
    :style="{ padding: cardPadding }"
    @click="handleClick"
  >
    <!-- 头部（可选） -->
    <div v-if="$slots.header" class="zl-card__header">
      <slot name="header" />
    </div>

    <!-- 内容区 -->
    <div class="zl-card__body">
      <slot />
    </div>

    <!-- 底部（可选） -->
    <div v-if="$slots.footer" class="zl-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.zl-card {
  background: var(--zl-bg);
  transition: all var(--zl-transition-normal);
  box-sizing: border-box;
}

/* 类型 */
.zl-card--default {
  background: var(--zl-bg);
  border: 1px solid var(--zl-border);
}

.zl-card--outline {
  background: transparent;
  border: 1px solid var(--zl-border);
}

.zl-card--flat {
  background: var(--zl-bg-cool);
  border: none;
}

/* 阴影 */
.zl-card--shadow-none { box-shadow: none; }
.zl-card--shadow-sm { box-shadow: var(--zl-shadow-sm); }
.zl-card--shadow-md { box-shadow: var(--zl-shadow-md); }
.zl-card--shadow-lg { box-shadow: var(--zl-shadow-lg); }
.zl-card--shadow-xl { box-shadow: var(--zl-shadow-xl); }

/* 圆角 */
.zl-card--round-none { border-radius: 0; }
.zl-card--round-sm { border-radius: var(--zl-radius-sm); }
.zl-card--round-md { border-radius: var(--zl-radius-md); }
.zl-card--round-lg { border-radius: var(--zl-radius-lg); }
.zl-card--round-xl { border-radius: var(--zl-radius-xl); }
.zl-card--round-full { border-radius: var(--zl-radius-full); }

/* Hover 效果 */
.zl-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--zl-shadow-lg);
}

/* 可点击 */
.zl-card--clickable {
  cursor: pointer;
}

.zl-card--clickable:active {
  transform: scale(0.98);
}

/* 内部结构 */
.zl-card__header {
  margin-bottom: var(--zl-space-md);
  padding-bottom: var(--zl-space-sm);
  border-bottom: 1px solid var(--zl-border);
}

.zl-card__body {
  /* 默认无额外样式 */
}

.zl-card__footer {
  margin-top: var(--zl-space-md);
  padding-top: var(--zl-space-sm);
  border-top: 1px solid var(--zl-border);
}
</style>
