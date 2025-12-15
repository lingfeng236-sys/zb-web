<script setup>
import { ref, reactive } from 'vue'
import { startLeaveProcess } from '@/api/workflow'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'StartIndex',
})

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  day: 1,
})

const rules = {
  name: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  day: [{ required: true, message: '请输入天数', trigger: 'blur' }],
}

const onSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await startLeaveProcess(form)
        if (res.code === 200) {
          ElMessage.success('申请提交成功！')
          router.push('/workflow/todo') // 跳转到待办，方便查看（如果流程自动通过可能就查不到了）
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="box-card" style="max-width: 600px; margin: 0 auto">
      <template #header>
        <div class="card-header">
          <span>发起请假申请</span>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="申请人" prop="name">
          <el-input v-model="form.name" placeholder="请输入您的姓名" />
        </el-form-item>

        <el-form-item label="请假天数" prop="day">
          <el-input-number v-model="form.day" :min="1" :max="30" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">提交申请</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
