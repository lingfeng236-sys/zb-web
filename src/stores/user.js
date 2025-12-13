import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi } from '@/api/auth'
// import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    // const router = useRouter()

    const login = async (loginForm) => {
      try {
        const res = await loginApi(loginForm)
        token.value = res
        return true
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const logout = () => {
      token.value = ''
      // 这里的 router 需要在组件里调用，或者使用 window.location
      window.location.href = '/login'
    }

    return { token, login, logout }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token'], // 只持久化 token 字段
    },
  },
)
