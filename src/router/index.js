import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import Guestbook from '../views/Guestbook.vue'
import Shop from '../views/Shop.vue'
import Friends from '../views/Friends.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

// 动态导入博客文章
const blogComponents = {
  'introduce-my-blog': () => import('../views/Blogs/Introduce_My_Blog.vue')
}

/**
 * 安全: 验证 JWT token 的基本结构和有效期（客户端预检）
 * 符合等保3.0 - 身份鉴别、访问控制
 * @returns {boolean}
 */
function isTokenValid() {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('blog_admin_token')
  if (!token || typeof token !== 'string') return false

  try {
    // JWT 格式: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Base64Url 解码 payload
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    )

    // 检查是否包含必要的 claim
    if (!payload || typeof payload !== 'object') return false
    if (payload.role !== 'admin') return false

    // 检查 token 是否已过期 (exp 为 UNIX 秒时间戳)
    if (payload.exp && typeof payload.exp === 'number') {
      const nowSeconds = Math.floor(Date.now() / 1000)
      if (nowSeconds >= payload.exp) {
        // Token 已过期，清除
        localStorage.removeItem('blog_admin_token')
        return false
      }
    }

    return true
  } catch {
    // 解析失败，token 不合法
    localStorage.removeItem('blog_admin_token')
    return false
  }
}

/**
 * 安全: 验证重定向路径，防止开放重定向攻击
 * 符合等保3.0 - 入侵防范
 * @param {string} redirectPath
 * @returns {string}
 */
function sanitizeRedirectPath(redirectPath) {
  if (!redirectPath || typeof redirectPath !== 'string') return '/admin'

  // 只允许以 / 开头的相对路径
  if (!redirectPath.startsWith('/')) return '/admin'

  // 禁止 protocol-relative URL (// 开头) 和常见攻击变体
  if (redirectPath.startsWith('//')) return '/admin'

  // 禁止包含 javascript:、data: 等危险 scheme
  const lower = redirectPath.toLowerCase()
  if (lower.includes('javascript:') || lower.includes('data:')) return '/admin'

  // 只允许以 /admin 开头的路径
  if (!redirectPath.startsWith('/admin')) return '/admin'

  return redirectPath
}

// 404 页面
import NotFound from '../views/NotFound.vue'

// 可修改: 路由配置和页面标题
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'DaZiDian - 春風若有憐花意，可否許我再少年？' }  // 可修改: 主页标题
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我 - DaZiDian' }  // 可修改: 关于我页面标题
  },
  {
    path: '/works',
    name: 'Works',
    beforeEnter() {
      window.location.href = 'https://github.com/DaZiDian'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: { title: '文章 - DaZiDian' }
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    component: Guestbook,
    meta: { title: '留言板 - DaZiDian' }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: Friends,
    meta: { title: '友情链接 - DaZiDian' }
  },
  {
    path: '/shop',
    name: 'Shops',
    component: Shop,
    meta: { title: '商铺 - DaZiDian' }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('../views/BlogDetail.vue'),
    meta: { title: (route) => `${route.params.slug} - DaZiDian` }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: '后台登录 - DaZiDian' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      title: '后台管理 - DaZiDian',
      requiresAuth: true
    }
  },
  {
    path: '/admin/blog',
    redirect: '/admin'
  },
  // 所有未匹配的路径重定向到 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面未找到 - DaZiDian' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach((to, from, next) => {
  // 安全: 使用更严格的 token 验证（不仅检查存在性，还验证结构和有效期）
  const tokenValid = isTokenValid()

  if (to.meta.requiresAuth && !tokenValid) {
    // 未认证或 token 无效/过期，强制跳转登录页
    localStorage.removeItem('blog_admin_token')
    next({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (to.path === '/admin/login' && tokenValid) {
    next('/admin')
    return
  }

  // 处理动态标题（支持函数形式）
  const title = typeof to.meta.title === 'function' 
    ? to.meta.title(to) 
    : to.meta.title || 'DaZiDian - Z1D1anWeb'
  document.title = title
  next()
})

// 导出 sanitizeRedirectPath 供 AdminLogin 使用
export { sanitizeRedirectPath }
export default router

