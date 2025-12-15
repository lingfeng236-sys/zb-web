<script setup>
import { getMyTodoTasks } from '@/api/workflow'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TodoIndex',
})

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getMyTodoTasks(queryParams)

    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAudit = (row) => {
  // 跳转到办理页面，带上taskId
  router.push(`/workflow/audit/${row.taskId}`)
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  fetchData()
}

const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的待办任务</span>
          <el-button type="primary" link @click="fetchData">刷新</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="processName" label="流程名称" width="180" />
        <el-table-column prop="taskName" label="当前任务节点" width="180" />
        <el-table-column prop="userName" label="发起人" width="120" />
        <el-table-column prop="createTime" label="接收时间" width="180" />
        <el-table-column prop="businessKey" label="业务单号" />

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleAudit(scope.row)">
              办理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px; text-align: right">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
