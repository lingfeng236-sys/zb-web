<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTaskDetail, completeTask } from '@/api/workflow'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'AuditIndex',
})
const route = useRoute()
const router = useRouter()

const taskId = route.params.taskId
const loading = ref(false)
const taskInfo = ref(null)
const businessData = ref({})
const comment = ref('')

// 获取详情数据
const initData = async () => {
  loading.value = true
  try {
    const res = await getTaskDetail(taskId)

    taskInfo.value = res.taskInfo
    businessData.value = res.businessData || {}
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 提交审批
const submitAudit = (approved) => {
  const actionText = approved ? '通过' : '拒绝'

  ElMessageBox.confirm(`确认要【${actionText}】该申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: approved ? 'success' : 'warning',
  }).then(async () => {
    loading.value = true
    try {
      // 构造流程变量，这里的 key (approved) 必须和 BPMN 流程图里的网关条件一致
      const variables = {
        approved: approved,
        comment: comment.value,
      }

      const res = await completeTask(taskId, variables)
      if (res.code === 200) {
        ElMessage.success('审批成功')
        router.push('/workflow/todo') // 返回待办列表
      } else {
        ElMessage.error(res.msg)
      }
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  if (taskId) {
    initData()
  }
})
</script>

<template>
  <div class="app-container" v-loading="loading">
    <el-card class="box-card" style="margin-bottom: 20px">
      <template #header>
        <span>业务详情 - {{ taskInfo?.processName || '加载中...' }}</span>
      </template>

      <div v-if="taskInfo?.processCode === 'process_leave'">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请人">{{ businessData.applicant }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ businessData.days }} 天</el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag>{{ businessData.status?.desc }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ taskInfo.createTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-else-if="taskInfo">
        <el-empty description="暂未适配该流程的详情展示" />
      </div>
    </el-card>

    <el-card>
      <template #header>
        <span>审批处理 - {{ taskInfo?.taskName }}</span>
      </template>

      <el-form label-width="100px">
        <el-form-item label="审批意见">
          <el-input v-model="comment" type="textarea" :rows="3" placeholder="请输入您的审批意见" />
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="submitAudit(true)">同 意</el-button>
          <el-button type="danger" @click="submitAudit(false)">拒 绝</el-button>
          <el-button @click="$router.back()">返 回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
