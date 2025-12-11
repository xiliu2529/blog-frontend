import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import TestAuth from '../views/TestAuth.vue'
import WriteArticlePage from '../views/WriteArticlePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },
    {
      path: '/test-auth',
      name: 'test-auth',
      component: TestAuth,
      meta: { requiresAuth: true }
    },
    {
      path: '/write',
      name: 'write',
      component: WriteArticlePage,
      meta: { requiresAuth: true } // 需要登录
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但未登录，跳转到登录页
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (isGuestRoute && authStore.isAuthenticated) {
    // 已登录用户访问游客页面，跳转到首页
    next({ name: 'home' })
  } else {
    // 验证token有效性
    if (authStore.isAuthenticated) {
      const isValid = await authStore.validateToken()
      if (!isValid && requiresAuth) {
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
      }
    }
    next()
  }
})

export default router
