import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'), // 父路由使用 Layout
      redirect: '/dashboard', // 访问 / 时自动重定向到 /dashboard
      children: [
        {
          path: 'dashboard', // 注意：这里不要写 /dashboard，写 dashboard 即可
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'), // 你的首页组件
          meta: { title: '数据看板' },
        },
        // 这里以后可以加更多页面，比如 /user
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: 'profile',
          component: () => import('@/views/profile/index.vue'),
          name: 'Profile',
          meta: { title: '个人中心' },
        },
        {
          path: 'workflow',
          component: () => import('@/views/workflow/todo.vue'),
          redirect: '/workflow/todo',
          name: 'Workflow',
          meta: { title: '工作流', icon: 'el-icon-s-operation' }, // 记得换个图标
          children: [
            {
              path: 'start',
              component: () => import('@/views/workflow/start.vue'),
              name: 'StartProcess',
              meta: { title: '发起流程' },
            },
            {
              path: 'todo',
              component: () => import('@/views/workflow/todo.vue'),
              name: 'MyTodo',
              meta: { title: '我的待办' },
            },
            // 隐藏路由：任务办理详情页
            {
              path: 'audit/:taskId',
              component: () => import('@/views/workflow/audit.vue'),
              name: 'TaskAudit',
              meta: { title: '任务办理', activeMenu: '/workflow/todo' },
              hidden: true,
            },
          ],
        },
      ],
    },
  ],
})

export default router
