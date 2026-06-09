<script setup>
/**
 * ZlTabbar.vue - 底部导航栏组件
 * 接收 props: { activeIndex: Number }
 * 5个Tab：首页/互动/添加/日历/个人
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ZlIcon from '@/components/common/ZlIcon.vue'

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  }
})

const route = useRoute()
const router = useRouter()

// Tab 配置
const tabs = [
  { name: '首页', icon: 'Home', iconFill: 'Home', path: '/home' },
  { name: '互动', icon: 'MessageCircle', iconFill: 'MessageCircle', path: '/interact' },
  { name: '添加', icon: 'Plus', iconFill: 'Plus', path: '/add', special: true },
  { name: '日历', icon: 'Calendar', iconFill: 'Calendar', path: '/calendar' },
  { name: '个人', icon: 'User', iconFill: 'User', path: '/profile' }
]

// 判断当前路由是否激活（支持子路由）
const isActive = (tabPath) => {
  return route.path.startsWith(tabPath)
}

// 切换 Tab（路由跳转）
const switchTab = (tabPath) => {
  router.push(tabPath)
}
</script>

<template>
  <div class="zl-tabbar">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ active: isActive(tab.path), special: tab.special }"
      @click="switchTab(tab.path)"
    >
      <!-- 特殊样式：添加按钮 -->
      <div v-if="tab.special" class="special-btn">
        <ZlIcon :name="tab.icon" :size="24" color="#FFFFFF" />
      </div>
      <!-- 普通 Tab -->
      <template v-else>
        <ZlIcon
          :name="isActive(tab.path) ? tab.iconFill : tab.icon"
          :size="24"
          :color="isActive(tab.path) ? 'var(--zl-brand)' : 'var(--zl-text-hint)'"
        />
        <span class="tab-label">{{ tab.name }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.zl-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--zl-tabbar-height);
  background: var(--zl-bg);
  border-top: 1px solid var(--zl-border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  max-width: 430px;
  margin: 0 auto;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--zl-space-xs);
  cursor: pointer;
  padding: var(--zl-space-sm) var(--zl-space-md);
  border-radius: var(--zl-radius-sm);
  /* 方案 B 动画 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item:active {
  transform: scale(0.95);  /* 按下时缩小到 95% */
}

.tab-item.active {
  transform: scale(1.1);  /* 选中时放大到 110% */
  /* 颜色变化在 template 里已处理（:color） */
}

.tab-label {
  font-size: var(--zl-font-xs);
  color: var(--zl-text-hint);
  transition: color var(--zl-transition-fast);
}

.tab-item.active .tab-label {
  color: var(--zl-brand);
  font-weight: 500;
}

/* 特殊按钮样式 */
.special-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--zl-radius-full);
  background: var(--zl-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--zl-shadow-md);
  transition: transform var(--zl-transition-fast);
}

.special-btn:active {
  transform: scale(0.95);
}

.tab-item.special {
  padding: 0;
}
</style>
