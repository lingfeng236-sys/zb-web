import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi } from '@/api/auth'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const router = useRouter()

  const login = async (loginForm) => {
    try {
      // === 真实对接后端代码 (暂时注释) ===
      // const res = await loginApi(loginForm)
      // token.value = res.data.token
      // localStorage.setItem('token', res.data.token)

      // === 模拟登录成功 (为了让你先看到效果) ===
      console.log('正在模拟登录...', loginForm)
      const mockToken = 'mock-token-123456'
      token.value = mockToken
      localStorage.setItem('token', mockToken)

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    token.value = ''
    localStorage.removeItem('token')
    // 这里的 router 需要在组件里调用，或者使用 window.location
    window.location.href = '/login'
  }

  return { token, login, logout }
})
