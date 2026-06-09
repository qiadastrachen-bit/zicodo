/**
 * index.js - 路由配置
 * 定义所有页面路由、懒加载、元数据
 */

import { createRouter, createWebHistory } from 'vue-router'

// 布局组件
import AppLayout from '@/layout/AppLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import SplashLayout from '@/layout/SplashLayout.vue'

// 路由定义
const routes = [
  {
    path: '/splash',
    name: 'Splash',
    component: SplashLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'SplashPage',
        component: () => import('@/pages/auth/SplashPage.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Auth',
        component: () => import('@/pages/auth/AuthPage.vue'),
        meta: { requiresAuth: false, title: '登录' }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { requiresAuth: false, title: '登录' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: { requiresAuth: false, title: '注册' }
      }
    ]
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/splash'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/PetHomePage.vue'),
        meta: { title: '首页', showTabBar: true }
      },
      {
        path: 'interact',
        name: 'Interact',
        component: () => import('@/pages/interact/InteractPage.vue'),
        meta: { title: '互动', showTabBar: true }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/pages/tasks/TaskCreatePage.vue'),
        meta: { title: '添加', showTabBar: true }
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/pages/tasks/CalendarPage.vue'),
        meta: { title: '日历', showTabBar: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/profile/ProfilePage.vue'),
        meta: { title: '个人', showTabBar: true }
      },
      // 任务相关
      {
        path: 'tasks',
        name: 'TaskList',
        component: () => import('@/pages/tasks/TaskListPage.vue'),
        meta: { title: '任务列表' }
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: () => import('@/pages/tasks/TaskDetailPage.vue'),
        meta: { title: '任务详情' }
      },
      // 团队相关
      {
        path: 'teams',
        name: 'TeamList',
        component: () => import('@/pages/team/TeamListPage.vue'),
        meta: { title: '团队' }
      },
      {
        path: 'teams/:id',
        name: 'TeamDetail',
        component: () => import('@/pages/team/TeamDetailPage.vue'),
        meta: { title: '团队详情' }
      },

      // 个人相关
      {
        path: 'profile/edit',
        name: 'ProfileEdit',
        component: () => import('@/pages/profile/ProfileEditPage.vue'),
        meta: { title: '编辑资料', showTabBar: false }
      },
      {
        path: 'profile/theme',
        name: 'Theme',
        component: () => import('@/pages/profile/ThemePage.vue'),
        meta: { title: '主题设置', showTabBar: false }
      },
      {
        path: 'profile/points',
        name: 'Points',
        component: () => import('@/pages/profile/PointsPage.vue'),
        meta: { title: '积分充值', showTabBar: false }
      },
      {
        path: 'profile/settings',
        name: 'Settings',
        component: () => import('@/pages/profile/SettingsPage.vue'),
        meta: { title: '设置', showTabBar: false }
      },
      {
        path: 'profile/about',
        name: 'About',
        component: () => import('@/pages/profile/AboutPage.vue'),
        meta: { title: '关于 zicodo', showTabBar: false }
      },
      {
        path: 'profile/about/features',
        name: 'AboutFeatures',
        component: () => import('@/pages/profile/AboutFeatures.vue'),
        meta: { title: '功能介绍', showTabBar: false }
      },
      {
        path: 'profile/about/help',
        name: 'AboutHelp',
        component: () => import('@/pages/profile/AboutHelp.vue'),
        meta: { title: '帮助与反馈', showTabBar: false }
      },
      {
        path: 'profile/about/contact',
        name: 'AboutContact',
        component: () => import('@/pages/profile/AboutContact.vue'),
        meta: { title: '联系我们', showTabBar: false }
      },
      {
        path: 'profile/pet-settings',
        name: 'PetSettings',
        component: () => import('@/pages/profile/PetSettingsPage.vue'),
        meta: { requiresAuth: true, title: '宠物设置', showTabBar: false }
      },
      {
        path: 'profile/dialogue-history',
        name: 'DialogueHistory',
        component: () => import('@/pages/profile/DialogueHistoryPage.vue'),
        meta: { title: '对话历史', showTabBar: false }
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: () => import('@/pages/profile/AchievementsPage.vue'),
        meta: { title: '成就' }
      },

      // 通知中心
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/pages/notifications/NotificationPage.vue'),
        meta: { title: '通知中心', showTabBar: false }
      }
    ]
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - zicodo`
  } else {
    document.title = 'zicodo'
  }

  const token = localStorage.getItem('zl_token')

  // 开屏页始终放行
  if (to.path === '/splash') {
    return true
  }

  // 需要登录但未登录 → 自动注册并登录
  if (to.meta.requiresAuth && !token) {
    try {
      // 动态导入 userStore 以避免循环依赖
      const { useUserStore } = await import('@/stores/user')
      const userStore = useUserStore()
      await userStore.autoLogin()
      // 登录成功后继续导航到目标页面
      return true
    } catch (error) {
      console.error('[Router] 自动登录失败:', error)
      // 自动登录失败也不显示登录页，继续导航让用户自行处理
      // 或者跳转到错误提示页
      return true
    }
  }

  // 已登录用户访问任何认证页（/auth、/auth/login、/auth/register） → 跳转首页
  if ((to.path === '/auth' || to.path.startsWith('/auth/')) && token) {
    return '/home'
  }

  // 继续导航
  return true
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等
  console.log(`[Router] ${from.path} → ${to.path}`)
})

export default router
