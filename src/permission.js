import router from './router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 引入进度条样式

// 配置 NProgress (去掉转圈圈的动画，只要进度条)
NProgress.configure({ showSpinner: false })

// 白名单：不需要登录也能访问的页面
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  // 1. 开启进度条
  NProgress.start()

  // 2. 获取 Token (注意：在 beforeEach 内部获取 store 此时 Pinia 已经安装好了)
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    // === 有 Token 的情况 ===
    if (to.path === '/login') {
      // 如果已经登录了，还想去登录页，直接踢回首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 去其他页面，放行
      next()
    }
  } else {
    // === 没有 Token 的情况 ===
    if (whiteList.includes(to.path)) {
      // 如果去的是白名单（比如登录页），放行
      next()
    } else {
      // 否则全部重定向到登录页
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
