<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { addOrEditUserApi } from '@/api/user' // 复用保存接口，或者用专门的 updateProfileApi
import DictSelect from '@/components/DictSelect/index.vue'
import { DictTypeEnum } from '@/enums/DictEnum'

defineOptions({
  name: 'ProfileIndex',
})

const userStore = useUserStore()
const activeTab = ref('info')

defineOptions

// === 基本资料表单 ===
const infoFormRef = ref()
const infoForm = reactive({
  id: '',
  username: '',
  nickname: '',
  gender: '',
  role: '',
})

const infoRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

// === 修改密码表单 ===
const pwdFormRef = ref()
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validatePass2 = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '长度至少 6 个字符', trigger: 'blur' },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
}

// 初始化数据
const initData = () => {
  const { id, username, nickname, gender, role } = userStore.userInfo
  infoForm.id = id
  infoForm.username = username // 只读
  infoForm.nickname = nickname
  infoForm.gender = gender?.code
  infoForm.role = role?.code // 角色通常也不让改，仅展示
}

// 提交基本资料
const submitInfo = async () => {
  await infoFormRef.value.validate(async (valid) => {
    if (valid) {
      // 复用后端的 addOrEdit 接口（注意：后端要支持只更新非空字段，或者这里传全）
      // 建议后端单独写一个 updateProfile 接口更安全
      await addOrEditUserApi({
        ...infoForm,
        password: '', // 密码留空不修改
      })
      ElMessage.success('资料更新成功')
      // 刷新 Store 里的数据
      await userStore.getUserInfo()
    }
  })
}

// 提交修改密码 (你需要确认后端有没有 updatePassword 接口)
// 假设后端接口路径是 /user/updatePassword?username=xx&newPwd=xx&oldPwd=xx
// 这里仅做演示
import request from '@/utils/request'
const submitPwd = async () => {
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      // 假设的调用
      await request({
        url: '/user/updatePassword',
        method: 'put',
        params: {
          username: infoForm.username,
          newPwd: pwdForm.newPassword,
          // 真实场景最好传 oldPwd 给后端校验
        },
      })
      ElMessage.success('密码修改成功，请重新登录')
      userStore.logout()
    }
  })
}

onMounted(() => {
  // 如果 Store 里还没数据，先拉取
  if (!userStore.userInfo.id) {
    userStore.getUserInfo().then(() => initData())
  } else {
    initData()
  }
})
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div class="account-header">
            <el-avatar :size="100" class="avatar">
              {{ infoForm.nickname?.charAt(0) }}
            </el-avatar>
            <h3 class="username">{{ infoForm.username }}</h3>
            <p class="role-name">{{ userStore.userInfo.role?.desc }}</p>
          </div>
          <div class="account-detail">
            <p>
              <el-icon><User /></el-icon> ID: {{ infoForm.id }}
            </p>
            <p>
              <el-icon><Timer /></el-icon> 注册时间: {{ userStore.userInfo.createTime }}
            </p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="info">
              <el-form
                ref="infoFormRef"
                :model="infoForm"
                :rules="infoRules"
                label-width="80px"
                style="max-width: 500px; margin-top: 20px"
              >
                <el-form-item label="用户名">
                  <el-input v-model="infoForm.username" disabled />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="infoForm.nickname" />
                </el-form-item>
                <el-form-item label="性别">
                  <DictSelect
                    v-model="infoForm.gender"
                    :dictType="DictTypeEnum.GENDER"
                    type="radio"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitInfo">保存修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="password">
              <el-form
                ref="pwdFormRef"
                :model="pwdForm"
                :rules="pwdRules"
                label-width="80px"
                style="max-width: 500px; margin-top: 20px"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" @click="submitPwd">重置密码</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.account-header {
  text-align: center;
  margin-bottom: 20px;
}
.avatar {
  background-color: #409eff;
  font-size: 32px;
}
.username {
  margin: 10px 0 5px;
  font-size: 20px;
}
.role-name {
  color: #999;
  font-size: 14px;
  margin: 0;
}
.account-detail p {
  font-size: 14px;
  color: #606266;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
</style>
