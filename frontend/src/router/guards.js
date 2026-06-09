/**
 * guards.js - 路由守卫
 * 导出鉴权逻辑，供 route/index.js 使用
 */

/**
 * 检查用户登录状态
 * @param {Object} to - 目标路由
 * @param {Object} from - 来源路由
 * @param {Function} next - 下一步函数
 */
export function checkAuth(to, from, next) {
  const token = localStorage.getItem('zl_token')

  // 需要登录的页面
  if (to.meta.requiresAuth!== false && !token) {
    // 保存目标路径，登录后跳转
    next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录但访问登录/注册页 → 跳转首页
  if ((to.path === '/auth' || to.path.startsWith('/auth/')) && token) {
    next('/home')
    return
  }

  next()
}

/**
 * 检查用户权限（家长/孩子）
 * @param {string} requiredRole - 需要的角色
 */
export function checkRole(requiredRole) {
  return (to, from, next) => {
    const userStr = localStorage.getItem('zl_user')
    if (!userStr) {
      next('/auth')
      return
    }

    const user = JSON.parse(userStr)
    if (user.role!== requiredRole) {
      // 权限不足，跳转首页
      next('/home')
      return
    }

    next()
  }
}

/**
 * 检查宠物是否存在
 * 如果不存在，引导用户创建宠物
 */
export function checkPet(to, from, next) {
  const petStr = localStorage.getItem('zl_pet')
  if (!petStr) {
    // 可以在这里引导用户创建宠物
    console.log('[Guard] 宠物不存在')
  }
  next()
}
