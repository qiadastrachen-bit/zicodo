/**
 * main.js - 应用入口
 * 挂载 Pinia、Router、全局样式、主题初始化
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

// 导入全局样式（会递归导入 tokens.css, reset.css, font-import.css）
import './styles/global.css'

// 创建应用实例
const app = createApp(App)

// 挂载 Pinia
const pinia = createPinia()
app.use(pinia)

// 初始化主题（在挂载 Router 之前）
const themeStore = useThemeStore()
themeStore.initTheme()

// 挂载 Router
app.use(router)

// 挂载应用
app.mount('#app')
