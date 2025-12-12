import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 这里暂时指向一个简单的 HelloWorld 页面，或者默认的 HomeView
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
  ],
})

export default router
