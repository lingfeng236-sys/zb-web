import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, registerApi } from '@/api/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const router = useRouter()

    const login = async (loginForm) => {
      try {
        const res = await loginApi(loginForm)
        token.value = res
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // === 新增：注册 Action ===
    const register = async (registerForm) => {
      try {
        await registerApi(registerForm)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const logout = () => {
      token.value = ''
      router.push('/login')
    }

    return { token, login, logout, register }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token'], // 只持久化 token 字段
    },
  },
)
