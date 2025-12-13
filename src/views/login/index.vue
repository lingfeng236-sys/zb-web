<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import DictSelect from '@/components/DictSelect/index.vue'
import { DictShowType } from '@/enums/DictTypeEnum'

defineOptions({
  name: 'LoginIndex',
})

const router = useRouter()
const userStore = useUserStore()

// === 状态控制 ===
const isRegister = ref(false) // false=登录, true=注册
const loading = ref(false)
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// === 登录数据 ===
const loginForm = reactive({
  username: 'zb',
  password: '123456',
})

const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// === 注册数据 ===
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  gender: 1, // 默认性别：1男 2女
  role: '', // 默认角色：1管理员 2普通用户
})

// 自定义校验：检查两次密码是否一致
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const registerRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
})

// === 业务逻辑 ===

// 切换模式（登录 <-> 注册）
const toggleMode = () => {
  isRegister.value = !isRegister.value
  // 切换时重置表单校验
  loginFormRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}

// 处理登录
const handleLogin = () => {
  if (!loginFormRef.value) return
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        router.push('/')
      } catch {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理注册
const handleRegister = () => {
  if (!registerFormRef.value) return
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.register(registerForm)
        ElMessage.success('注册成功，请登录')
        // 注册成功后，自动切回登录模式
        isRegister.value = false
      } catch (e) {
        ElMessage.error('注册失败', e)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>{{ isRegister ? '用户注册' : '后台管理系统' }}</h2>
        </div>
      </template>

      <el-form
        v-if="!isRegister"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        size="large"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" class="w-100" @click="handleLogin">
            立即登录
          </el-button>
        </el-form-item>

        <div class="form-footer">
          <el-link type="primary" @click="toggleMode">没有账号？去注册</el-link>
        </div>
      </el-form>

      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        size="large"
      >
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="设置用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="设置密码 (至少6位)"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="gender">
          <DictSelect
            v-model="registerForm.gender"
            dict-code="gender"
            placeholder="请选择性别"
            :type="DictShowType.RADIO"
          />
        </el-form-item>

        <el-form-item prop="role" label="角色">
          <DictSelect
            v-model="registerForm.role"
            dict-code="packaging_version"
            placeholder="请选择角色"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="success" :loading="loading" class="w-100" @click="handleRegister">
            立即注册
          </el-button>
        </el-form-item>

        <div class="form-footer">
          <el-link type="info" @click="toggleMode">已有账号？去登录</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg'); /* 加个背景纹理 */
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-card {
  width: 420px;
  border-radius: 8px;
}

.card-header h2 {
  text-align: center;
  margin: 0;
  color: #303133;
}

.w-100 {
  width: 100%;
}

.form-footer {
  text-align: center;
  margin-top: -10px;
}
</style>
