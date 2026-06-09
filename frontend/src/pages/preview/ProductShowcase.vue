<script setup>
/**
 * ProductShowcase - 产品发布会宣传页面
 * 展示项目的图标库和组件库
 */
import { ref, onMounted, nextTick } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

// 项目中实际使用的图标（按功能分组）
const iconCategories = ref([
  {
    name: '导航与操作',
    icons: ['Home', 'Calendar', 'User', 'Settings', 'Bell', 'Search', 'Plus', 'ChevronLeft', 'ChevronRight', 'X', 'Check']
  },
  {
    name: '任务与时间',
    icons: ['Check', 'CheckCircle', 'Clock', 'Calendar', 'MapPin', 'FileText', 'Bell', 'Pencil', 'Trash2', 'Repeat']
  },
  {
    name: '团队与协作',
    icons: ['Users', 'UserPlus', 'LogIn', 'LogOut', 'MoreHorizontal', 'MoreVertical', 'Eye', 'EyeOff']
  },
  {
    name: '宠物与积分',
    icons: ['Sparkles', 'Cat', 'Heart', 'Zap', 'Brain', 'Gift', 'TrendingUp']
  },
  {
    name: '信息与状态',
    icons: ['Info', 'AlertTriangle', 'CheckCircle', 'XCircle', 'MessageCircle', 'HelpCircle']
  },
  {
    name: '系统与设置',
    icons: ['Palette', 'Music', 'Smartphone', 'Award', 'Star', 'Sun', 'Moon']
  }
])

// 组件展示区的数据
const componentShowcases = ref([
  {
    name: '按钮组件',
    description: '支持主按钮、次按钮、危险按钮等多种样式',
    type: 'button'
  },
  {
    name: '卡片组件',
    description: '统一的卡片容器，支持阴影、圆角、边框',
    type: 'card'
  },
  {
    name: '列表项组件',
    description: '支持图标、标题、描述、箭头等多种配置',
    type: 'list-item'
  },
  {
    name: '输入框组件',
    description: '支持普通输入、带图标、带清除按钮',
    type: 'input'
  },
  {
    name: '弹窗组件',
    description: '支持标题、内容、自定义底部按钮',
    type: 'modal'
  },
  {
    name: '消息提示组件',
    description: '支持信息、成功、警告、错误四种状态',
    type: 'toast'
  },
  {
    name: '顶部导航栏',
    description: '支持返回按钮、标题、右侧操作',
    type: 'topbar'
  },
  {
    name: '底部标签栏',
    description: '5个标签页切换，支持动态图标',
    type: 'tabbar'
  },
  {
    name: '空状态组件',
    description: '用于无数据状态展示，含图片、文案、操作按钮',
    type: 'empty'
  }
])

// 组件展示弹窗
const showModal = ref(false)
const showToast = ref(false)
const toastType = ref('info')
const toastMessage = ref('这是一条消息提示')

// 点击图标时展示提示
const handleIconClick = (iconName) => {
  toastMessage.value = `点击了 ${iconName} 图标`
  toastType.value = 'success'
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 组件操作演示
const showButtonDemo = (type) => {
  const messages = {
    primary: '主按钮被点击！',
    secondary: '次按钮被点击！',
    danger: '危险按钮被点击！'
  }
  toastMessage.value = messages[type] || '按钮被点击！'
  toastType.value = type === 'danger' ? 'error' : (type === 'primary' ? 'success' : 'info')
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const openModal = () => {
  showModal.value = true
}

// 动态获取图标组件
const getIconComponent = (iconName) => {
  return LucideIcons[iconName] || null
}

// 统计信息
const totalIcons = iconCategories.value.reduce((sum, cat) => sum + cat.icons.length, 0)
const totalComponents = componentShowcases.value.length

// 页面加载动画
const showContent = ref(false)
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    showContent.value = true
  }, 100)
})
</script>

<template>
  <div class="product-showcase">
    <!-- 头部区域 -->
    <header class="showcase-header">
      <div class="header-content" :class="{ 'animate-in': showContent }">
        <div class="logo-badge">
          <component :is="getIconComponent('Sparkles')" :size="32" color="var(--zl-brand)" />
        </div>
        <h1 class="project-title">zicodo 产品组件库</h1>
        <p class="project-subtitle">基于 Vue 3 + Lucide Icons 打造的现代化 UI 系统</p>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-number">{{ totalIcons }}+</span>
            <span class="stat-label">图标</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ totalComponents }}+</span>
            <span class="stat-label">组件</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">1</span>
            <span class="stat-label">设计系统</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 图标库展示 -->
    <section class="showcase-section" :class="{ 'animate-in': showContent }">
      <div class="section-header">
        <h2 class="section-title">
          <component :is="getIconComponent('Sparkles')" :size="24" color="var(--zl-brand)" />
          图标库 Icons
        </h2>
        <p class="section-desc">采用 Lucide Icons — 极简线性风格图标，共 {{ totalIcons }}+ 个常用图标</p>
      </div>

      <div class="icon-categories">
        <div
          v-for="category in iconCategories"
          :key="category.name"
          class="icon-category"
        >
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="icon-grid">
            <div
              v-for="iconName in category.icons"
              :key="iconName"
              class="icon-card"
              @click="handleIconClick(iconName)"
            >
              <component
                :is="getIconComponent(iconName)"
                :size="24"
                color="var(--zl-text-primary)"
              />
              <span class="icon-name">{{ iconName }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 组件库展示 -->
    <section class="showcase-section" :class="{ 'animate-in': showContent }">
      <div class="section-header">
        <h2 class="section-title">
          <component :is="getIconComponent('Users')" :size="24" color="var(--zl-brand)" />
          组件库 Components
        </h2>
        <p class="section-desc">自研组件系统 — {{ totalComponents }}+ 个核心业务组件</p>
      </div>

      <div class="component-grid">
        <!-- 按钮组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('Check')" :size="20" color="var(--zl-brand)" />
            <h3>按钮组件</h3>
          </div>
          <p class="component-desc">支持主按钮、次按钮、危险按钮等多种样式</p>
          <div class="component-preview">
            <button class="demo-btn primary" @click="showButtonDemo('primary')">主按钮</button>
            <button class="demo-btn secondary" @click="showButtonDemo('secondary')">次按钮</button>
            <button class="demo-btn danger" @click="showButtonDemo('danger')">危险按钮</button>
          </div>
        </div>

        <!-- 卡片组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('FileText')" :size="20" color="var(--zl-brand)" />
            <h3>卡片组件</h3>
          </div>
          <p class="component-desc">统一的卡片容器，支持阴影、圆角、边框</p>
          <div class="component-preview">
            <div class="demo-card">
              <div class="demo-card-title">卡片标题</div>
              <div class="demo-card-content">这是卡片内容区域，可以放置任何内容</div>
            </div>
          </div>
        </div>

        <!-- 列表项组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('MoreHorizontal')" :size="20" color="var(--zl-brand)" />
            <h3>列表项组件</h3>
          </div>
          <p class="component-desc">支持图标、标题、描述、箭头等多种配置</p>
          <div class="component-preview">
            <div class="demo-list-item">
              <component :is="getIconComponent('Settings')" :size="20" color="var(--zl-text-secondary)" />
              <span class="demo-list-text">设置选项</span>
              <component :is="getIconComponent('ChevronRight')" :size="16" color="var(--zl-text-hint)" />
            </div>
            <div class="demo-list-item">
              <component :is="getIconComponent('User')" :size="20" color="var(--zl-text-secondary)" />
              <span class="demo-list-text">个人资料</span>
              <component :is="getIconComponent('ChevronRight')" :size="16" color="var(--zl-text-hint)" />
            </div>
          </div>
        </div>

        <!-- 输入框组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('Search')" :size="20" color="var(--zl-brand)" />
            <h3>输入框组件</h3>
          </div>
          <p class="component-desc">支持普通输入、带图标、带清除按钮</p>
          <div class="component-preview">
            <div class="demo-input-wrapper">
              <component :is="getIconComponent('Search')" :size="16" color="var(--zl-text-hint)" class="demo-input-icon" />
              <input type="text" placeholder="请输入搜索内容..." class="demo-input" />
            </div>
          </div>
        </div>

        <!-- 弹窗组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('AlertTriangle')" :size="20" color="var(--zl-brand)" />
            <h3>弹窗组件</h3>
          </div>
          <p class="component-desc">支持标题、内容、自定义底部按钮</p>
          <div class="component-preview">
            <button class="demo-btn primary" @click="openModal">打开弹窗</button>
          </div>
        </div>

        <!-- 消息提示组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('Info')" :size="20" color="var(--zl-brand)" />
            <h3>消息提示组件</h3>
          </div>
          <p class="component-desc">支持信息、成功、警告、错误四种状态</p>
          <div class="component-preview">
            <div class="demo-toast-row">
              <div class="demo-toast info">
                <component :is="getIconComponent('Info')" :size="16" />
                <span>信息</span>
              </div>
              <div class="demo-toast success">
                <component :is="getIconComponent('CheckCircle')" :size="16" />
                <span>成功</span>
              </div>
            </div>
            <div class="demo-toast-row">
              <div class="demo-toast warning">
                <component :is="getIconComponent('AlertTriangle')" :size="16" />
                <span>警告</span>
              </div>
              <div class="demo-toast error">
                <component :is="getIconComponent('XCircle')" :size="16" />
                <span>错误</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 顶部导航栏演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('ChevronLeft')" :size="20" color="var(--zl-brand)" />
            <h3>顶部导航栏</h3>
          </div>
          <p class="component-desc">支持返回按钮、标题、右侧操作</p>
          <div class="component-preview">
            <div class="demo-topbar">
              <button class="demo-topbar-btn">
                <component :is="getIconComponent('ChevronLeft')" :size="20" />
              </button>
              <span class="demo-topbar-title">页面标题</span>
              <button class="demo-topbar-btn">
                <component :is="getIconComponent('Settings')" :size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- 底部标签栏演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('Home')" :size="20" color="var(--zl-brand)" />
            <h3>底部标签栏</h3>
          </div>
          <p class="component-desc">5个标签页切换，支持动态图标</p>
          <div class="component-preview">
            <div class="demo-tabbar">
              <div class="demo-tab active">
                <component :is="getIconComponent('Home')" :size="20" />
                <span>首页</span>
              </div>
              <div class="demo-tab">
                <component :is="getIconComponent('Calendar')" :size="20" />
                <span>任务</span>
              </div>
              <div class="demo-tab">
                <component :is="getIconComponent('Users')" :size="20" />
                <span>团队</span>
              </div>
              <div class="demo-tab">
                <component :is="getIconComponent('MessageCircle')" :size="20" />
                <span>互动</span>
              </div>
              <div class="demo-tab">
                <component :is="getIconComponent('User')" :size="20" />
                <span>我的</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态组件演示 -->
        <div class="component-card">
          <div class="component-header">
            <component :is="getIconComponent('FileText')" :size="20" color="var(--zl-brand)" />
            <h3>空状态组件</h3>
          </div>
          <p class="component-desc">用于无数据状态展示，含图片、文案、操作按钮</p>
          <div class="component-preview">
            <div class="demo-empty">
              <div class="demo-empty-icon">
                <component :is="getIconComponent('HelpCircle')" :size="32" color="var(--zl-text-hint)" />
              </div>
              <div class="demo-empty-text">暂无数据</div>
              <button class="demo-btn small">重新加载</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计系统展示 -->
    <section class="showcase-section" :class="{ 'animate-in': showContent }">
      <div class="section-header">
        <h2 class="section-title">
          <component :is="getIconComponent('Palette')" :size="24" color="var(--zl-brand)" />
          设计系统 Design System
        </h2>
        <p class="section-desc">统一的视觉规范和交互标准</p>
      </div>

      <div class="design-system">
        <div class="color-grid">
          <h3 class="design-title">色彩系统</h3>
          <div class="color-row">
            <div class="color-item" style="background: var(--zl-brand);">
              <span>主色</span>
            </div>
            <div class="color-item" style="background: var(--zl-success);">
              <span>成功</span>
            </div>
            <div class="color-item" style="background: var(--zl-warning);">
              <span>警告</span>
            </div>
            <div class="color-item" style="background: var(--zl-error);">
              <span>错误</span>
            </div>
          </div>
        </div>

        <div class="spacing-demo">
          <h3 class="design-title">间距系统</h3>
          <div class="spacing-row">
            <div class="spacing-item" style="width: 8px;"></div>
            <div class="spacing-item" style="width: 12px;"></div>
            <div class="spacing-item" style="width: 16px;"></div>
            <div class="spacing-item" style="width: 24px;"></div>
            <div class="spacing-item" style="width: 32px;"></div>
          </div>
          <div class="spacing-labels">
            <span>8px</span>
            <span>12px</span>
            <span>16px</span>
            <span>24px</span>
            <span>32px</span>
          </div>
        </div>

        <div class="radius-demo">
          <h3 class="design-title">圆角系统</h3>
          <div class="radius-row">
            <div class="radius-item" style="border-radius: 4px;">4px</div>
            <div class="radius-item" style="border-radius: 8px;">8px</div>
            <div class="radius-item" style="border-radius: 12px;">12px</div>
            <div class="radius-item" style="border-radius: 16px;">16px</div>
          </div>
        </div>

        <div class="typography-demo">
          <h3 class="design-title">字体系统</h3>
          <div class="typography-row">
            <div class="typography-item large">标题 24px</div>
            <div class="typography-item medium">正文 16px</div>
            <div class="typography-item small">辅助 14px</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部区域 -->
    <footer class="showcase-footer" :class="{ 'animate-in': showContent }">
      <div class="footer-content">
        <div class="footer-logo">
          <component :is="getIconComponent('Sparkles')" :size="24" color="var(--zl-brand)" />
          <span>zicodo</span>
        </div>
        <p class="footer-text">现代化宠物互动与任务管理平台</p>
        <p class="footer-version">Version 0.0.1</p>
      </div>
    </footer>

    <!-- 弹窗演示 -->
    <div v-if="showModal" class="demo-modal-overlay" @click.self="showModal = false">
      <div class="demo-modal">
        <div class="demo-modal-header">
          <h3>弹窗标题</h3>
          <button class="demo-modal-close" @click="showModal = false">
            <component :is="getIconComponent('X')" :size="20" />
          </button>
        </div>
        <div class="demo-modal-body">
          <p>这是弹窗的内容区域。可以放置任何自定义内容，包括表单、提示信息等。</p>
        </div>
        <div class="demo-modal-footer">
          <button class="demo-btn secondary" @click="showModal = false">取消</button>
          <button class="demo-btn primary" @click="showModal = false">确定</button>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <transition name="toast-fade">
      <div v-if="showToast" class="demo-toast-container" :class="toastType">
        <component :is="getIconComponent(
          toastType === 'success' ? 'CheckCircle' :
          toastType === 'error' ? 'XCircle' :
          toastType === 'warning' ? 'AlertTriangle' : 'Info'
        )" :size="20" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.product-showcase {
  min-height: 100vh;
  background: var(--zl-bg);
  padding: 0;
}

/* 头部区域 */
.showcase-header {
  background: linear-gradient(135deg, var(--zl-brand) 0%, var(--zl-brand-light) 100%);
  padding: 60px 24px 80px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.showcase-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.header-content {
  position: relative;
  z-index: 1;
}

.logo-badge {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  backdrop-filter: blur(10px);
}

.project-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -1px;
}

.project-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 32px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.15);
  padding: 20px 40px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 通用区块 */
.showcase-section {
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--zl-text-primary);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.section-desc {
  font-size: 16px;
  color: var(--zl-text-secondary);
  margin: 0;
}

/* 图标库展示 */
.icon-categories {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.icon-category {
  background: var(--zl-surface);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--zl-border);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.icon-card {
  background: var(--zl-bg);
  border: 1px solid var(--zl-border);
  border-radius: 12px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-card:hover {
  background: var(--zl-brand-light);
  border-color: var(--zl-brand);
  transform: translateY(-2px);
}

.icon-name {
  font-size: 12px;
  color: var(--zl-text-secondary);
  text-align: center;
}

/* 组件库展示 */
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.component-card {
  background: var(--zl-surface);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.component-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.component-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.component-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0;
}

.component-desc {
  font-size: 14px;
  color: var(--zl-text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
}

.component-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 按钮演示 */
.demo-btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.demo-btn.primary {
  background: var(--zl-brand);
  color: white;
}

.demo-btn.primary:hover {
  background: var(--zl-brand-dark);
}

.demo-btn.secondary {
  background: var(--zl-surface);
  color: var(--zl-text-primary);
  border: 1px solid var(--zl-border);
}

.demo-btn.secondary:hover {
  background: var(--zl-bg);
}

.demo-btn.danger {
  background: var(--zl-error);
  color: white;
}

.demo-btn.danger:hover {
  opacity: 0.9;
}

.demo-btn.small {
  padding: 8px 16px;
  font-size: 13px;
}

/* 卡片演示 */
.demo-card {
  background: var(--zl-bg);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--zl-border);
}

.demo-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--zl-text-primary);
  margin-bottom: 8px;
}

.demo-card-content {
  font-size: 14px;
  color: var(--zl-text-secondary);
  line-height: 1.6;
}

/* 列表项演示 */
.demo-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--zl-bg);
  border-radius: 12px;
}

.demo-list-text {
  flex: 1;
  font-size: 14px;
  color: var(--zl-text-primary);
}

/* 输入框演示 */
.demo-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--zl-bg);
  border: 1px solid var(--zl-border);
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.2s ease;
}

.demo-input-wrapper:focus-within {
  border-color: var(--zl-brand);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.demo-input-icon {
  color: var(--zl-text-hint);
}

.demo-input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--zl-text-primary);
  outline: none;
}

.demo-input::placeholder {
  color: var(--zl-text-hint);
}

/* Toast 演示 */
.demo-toast-row {
  display: flex;
  gap: 8px;
}

.demo-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.demo-toast.info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--zl-brand);
}

.demo-toast.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--zl-success);
}

.demo-toast.warning {
  background: rgba(234, 179, 8, 0.1);
  color: var(--zl-warning);
}

.demo-toast.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--zl-error);
}

/* 顶部导航栏演示 */
.demo-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--zl-bg);
  border-radius: 12px;
}

.demo-topbar-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--zl-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.demo-topbar-btn:hover {
  background: var(--zl-bg-cool);
}

.demo-topbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--zl-text-primary);
}

/* 底部标签栏演示 */
.demo-tabbar {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: var(--zl-bg);
  border-radius: 12px;
}

.demo-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  color: var(--zl-text-hint);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.demo-tab.active {
  color: var(--zl-brand);
}

.demo-tab:hover {
  background: var(--zl-bg-cool);
}

/* 空状态演示 */
.demo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--zl-bg);
  border-radius: 12px;
}

.demo-empty-icon {
  opacity: 0.5;
}

.demo-empty-text {
  font-size: 14px;
  color: var(--zl-text-secondary);
}

/* 设计系统 */
.design-system {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.color-grid, .spacing-demo, .radius-demo, .typography-demo {
  background: var(--zl-surface);
  border-radius: 20px;
  padding: 24px;
}

.design-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--zl-text-primary);
  margin: 0 0 16px;
}

.color-row {
  display: flex;
  gap: 12px;
}

.color-item {
  flex: 1;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 500;
}

.spacing-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.spacing-item {
  height: 24px;
  background: var(--zl-brand);
  border-radius: 4px;
}

.spacing-labels {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--zl-text-secondary);
}

.radius-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radius-item {
  width: 80px;
  height: 40px;
  background: var(--zl-brand-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--zl-brand);
}

.typography-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.typography-item {
  padding: 12px;
  background: var(--zl-bg);
  border-radius: 8px;
  color: var(--zl-text-primary);
}

.typography-item.large {
  font-size: 24px;
  font-weight: 700;
}

.typography-item.medium {
  font-size: 16px;
}

.typography-item.small {
  font-size: 14px;
  color: var(--zl-text-secondary);
}

/* 底部区域 */
.showcase-footer {
  background: var(--zl-surface);
  padding: 48px 24px;
  margin-top: 48px;
  border-top: 1px solid var(--zl-border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--zl-text-primary);
  margin-bottom: 12px;
}

.footer-text {
  font-size: 14px;
  color: var(--zl-text-secondary);
  margin: 0 0 8px;
}

.footer-version {
  font-size: 12px