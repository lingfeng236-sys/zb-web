import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, registerApi, getUserInfoApi } from '@/api/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const router = useRouter()
    // 用户信息对象
    const userInfo = ref({})
    const login = async (loginForm) => {
      const res = await loginApi(loginForm)
      token.value = res
      // 登录成功后，立即获取用户信息
      await getUserInfo()
    }
    // === 新增：注册 Action ===
    const register = async (registerForm) => {
      await registerApi(registerForm)
    }

    const logout = () => {
      token.value = ''
      router.push('/login')
    }

    const getUserInfo = async () => {
      const res = await getUserInfoApi()
      userInfo.value = res
    }

    return { token, login, logout, register, userInfo, getUserInfo }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token'], // 只持久化 token 和 userInfo 字段
    },
  },
)
