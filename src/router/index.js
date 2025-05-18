import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import PostEdit from '../views/PostEdit.vue'
import UserProfile from '../views/UserProfile.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  // history: createWebHistory(import.meta.env.VITE_APP_API_BASE),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetail
    },
    {
      path: '/post/edit/:id?',
      name: 'post-edit',
      component: PostEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'user-profile',
      component: UserProfile
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // 已登录用户不能访问登录和注册页
  if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
