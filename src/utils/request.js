import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8080/', // 建议改为 import.meta.env.VITE_APP_BASE_API
  timeout: 10000, // 超时时间改短一点，50s太长了
})

// === 1. 防止重复弹窗的变量 ===
let isReloginShow = false

// === 2. HTTP 状态码错误映射 ===
const httpStatusMap = {
  400: '请求参数错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持',
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 假设后端约定 code 为 200 是成功
    if (res.code === 200) {
      return res.data
    }

    // === 3. 业务错误处理 ===
    // 401: Token 过期或未登录 (业务层面的 401)
    if (res.code === 401) {
      if (!isReloginShow) {
        isReloginShow = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const userStore = useUserStore()
            userStore.logout() // 调用 store 的登出 action
            isReloginShow = false
          })
          .catch(() => {
            isReloginShow = false
          })
      }
    } else {
      // 其他业务错误直接提示
      ElMessage.error(res.msg || res.message || '系统错误')
    }

    return Promise.reject(new Error(res.msg || res.message || 'Error'))
  },
  (error) => {
    // === 4. HTTP 网络错误处理 ===
    console.error('err' + error)
    let message = ''

    if (error.response && error.response.status) {
      message = httpStatusMap[error.response.status] || `连接出错(${error.response.status})`
    } else if (error.message.includes('timeout')) {
      message = '网络请求超时'
    } else if (error.message.includes('Network Error')) {
      message = '网络连接异常，请检查您的网络'
    } else {
      message = error.message
    }

    ElMessage.error({
      message: message,
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default service
