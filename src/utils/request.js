import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 1. 创建 axios 实例
const service = axios.create({
  // 这里的 /api 是为了后续配置代理，或者直接填后端地址
  baseURL: '/api',
  timeout: 5000,
})

// 2. 请求拦截器：发送请求前做些什么
service.interceptors.request.use(
  (config) => {
    // 从 Pinia Store 获取 token
    const userStore = useUserStore()
    if (userStore.token) {
      // 如果有 token，把它放到请求头里带给后端
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 3. 响应拦截器：收到响应后做些什么
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 假设后端约定：code === 200 代表成功
    // 注意：这里需要根据你实际后端的约定修改
    if (res.code !== 200) {
      ElMessage.error(res.message || '系统错误')

      // 401 代表 Token 过期或未登录
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    // 处理网络错误
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  },
)

export default service
