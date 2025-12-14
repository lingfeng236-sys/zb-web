<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserPageApi, deleteUserApi, registerApi } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Delete, Edit } from '@element-plus/icons-vue'

defineOptions({ name: 'UserIndex' })

// === 数据定义 ===
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: '',
  gender: '', // 这里绑定的将是 code (Integer)
  role: '', // 这里绑定的将是 code (Integer)
})

// 新增/编辑表单相关
const dialogVisible = ref(false)
const formRef = ref()
const formType = ref('add') // 'add' or 'edit'
const form = reactive({
  username: '',
  password: '', // 只有新增时必填
  nickname: '',
  gender: '',
  role: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// === 方法定义 ===

// 1. 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getUserPageApi({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      username: queryParams.username,
      // 如果后端支持根据 code 查询，这里可以直接传
      // genderCode: queryParams.gender,
      // roleCode: queryParams.role
    })
    // 后端返回的是 Result<Page<User>>，records 是数据列表
    tableData.value = res.records
    total.value = res.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 2. 搜索 & 重置
const handleSearch = () => {
  queryParams.pageNo = 1
  getList()
}
const resetQuery = () => {
  queryParams.username = ''
  queryParams.gender = ''
  queryParams.role = ''
  handleSearch()
}

// 3. 分页事件
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getList()
}
const handleCurrentChange = (val) => {
  queryParams.pageNo = val
  getList()
}

// 4. 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除用户 "${row.username}" 吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteUserApi(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

// 5. 打开新增弹窗
const openAddDialog = () => {
  formType.value = 'add'
  // 重置表单
  form.username = ''
  form.password = '' // 默认密码
  form.nickname = ''
  form.gender = 1 // 默认男
  form.role = 2 // 默认普通用户
  dialogVisible.value = true
}

// 6. 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (formType.value === 'add') {
        // 调用之前的注册接口作为新增
        await registerApi(form)
        ElMessage.success('新增成功')
      } else {
        // 这里的 edit 接口还没写，你可以自己补充
        ElMessage.warning('编辑功能暂未实现')
      }
      dialogVisible.value = false
      getList()
    }
  })
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="性别">
          <DictSelect
            v-model="queryParams.gender"
            dictType="gender"
            placeholder="全部"
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item label="角色">
          <DictSelect
            v-model="queryParams.role"
            dictType="role"
            placeholder="全部"
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="table-operations" style="margin: 15px 0">
      <el-button type="primary" :icon="Plus" @click="openAddDialog">新增用户</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickname" label="昵称" width="150" />

      <el-table-column prop="gender" label="性别" width="100" align="center">
        <template #default="scope">
          <el-tag
            v-if="scope.row.gender"
            :type="scope.row.gender.code === 1 ? 'primary' : 'danger'"
          >
            {{ scope.row.gender.desc }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column prop="role" label="角色" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.role" type="success">
            {{ scope.row.role.desc }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="180" />

      <el-table-column label="操作" fixed="right" min-width="150">
        <template #default="scope">
          <el-button link type="primary" :icon="Edit" @click="ElMessage.info('功能开发中...')">
            编辑
          </el-button>
          <el-button link type="danger" :icon="Delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px; display: flex; justify-content: flex-end">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="formType === 'add'">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入初始密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <DictSelect v-model="form.gender" dictType="gender" type="radio" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <DictSelect v-model="form.role" dictType="role" placeholder="请选择角色" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-card {
  margin-bottom: 20px;
}
</style>
