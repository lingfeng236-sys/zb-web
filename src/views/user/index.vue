<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserPageApi, deleteUserApi, addOrEditUserApi, getUserDetailApi } from '@/api/user'
import { Plus, Search, Refresh, Delete, Edit } from '@element-plus/icons-vue'
import { AddEditEnum } from '@/enums/Constant'
import { DictShowType, DictTypeEnum } from '@/enums/DictEnum'

defineOptions({ name: 'UserIndex' })

// === 数据定义 ===
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 2,
  username: '',
  gender: '', // 这里绑定的将是 code (Integer)
  role: '', // 这里绑定的将是 code (Integer)
})

// 新增/编辑表单相关
const dialogVisible = ref(false)
const formRef = ref()
const formType = ref('add') // 'add' or 'edit'
const form = reactive({
  id: undefined,
  username: '',
  password: '', // 只有新增时必填
  nickname: '',
  gender: '',
  role: '',
})

// ✅ 动态规则：密码仅在新增时必填
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  // password 的规则我们在打开弹窗时动态处理
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
})

// === 方法定义 ===

// 1. 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getUserPageApi(queryParams)
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
  queryParams.pageNum = 1
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
  queryParams.pageNum = val
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

//  openAddDialog 方法
const openAddDialog = async (type, row) => {
  formType.value = type
  dialogVisible.value = true

  // 1. 先重置表单（清空上一轮的校验和数据）
  // 必须在 nextTick 里，因为 dialogVisible=true 后 DOM 还没完全渲染，formRef 可能是空的
  await nextTick()
  if (formRef.value) {
    formRef.value.resetFields()
    rules.password[0].required = type === 'add'
  }

  // 2. 根据类型处理数据
  if (type === 'edit' && row) {
    // === 核心变化：调用后端接口获取最新数据 ===
    try {
      // 开启局部 loading (可选，提升体验)
      loading.value = true

      const res = await getUserDetailApi(row.id)
      const data = res // 假设 request.js 响应拦截器直接返回了 data，如果是 res.data 请调整

      // 3. 数据回显
      // 注意：后端返回的可能是 Enum 对象 {code:1, desc:'男'}，表单需要提取 code
      Object.assign(form, {
        id: data.id,
        username: data.username,
        nickname: data.nickname,
        gender: data.gender?.code, // 提取枚举值的 code
        role: data.role?.code, // 提取枚举值的 code
        password: '', // 密码依然留空，避免回显加密后的乱码
      })
    } catch (e) {
      console.error('获取详情失败', e)
      ElMessage.error('获取数据失败，请重试')
      dialogVisible.value = false // 失败则关窗
    } finally {
      loading.value = false
    }
  } else {
    // === 新增模式 ===
    // 手动清空 id (resetFields 不负责这个)
    form.id = undefined
    form.username = ''
    form.password = ''
    form.nickname = ''
    form.gender = 1
    form.role = 2
  }
}

// 6. 提交表单 (修改为调用 addOrEdit)
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 统一调用 addOrEdit 接口
        // 如果是编辑且密码为空，后端 UserSaveDto 接收到 password 为空字符串
        // 你可能需要在后端 UserService 额外判断一下：如果 password 为空则不更新密码字段
        await addOrEditUserApi(form)

        ElMessage.success(formType.value === 'add' ? '新增成功' : '修改成功')
        dialogVisible.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
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
            :dictType="DictTypeEnum.GENDER"
            placeholder="全部"
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item label="角色">
          <DictSelect
            v-model="queryParams.role"
            :dictType="DictTypeEnum.ROLE"
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
      <el-button type="primary" :icon="Plus" @click="openAddDialog('add')">新增用户</el-button>
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
          <el-button link type="primary" :icon="Edit" @click="openAddDialog('edit', scope.row)">
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
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[2, 5, 10]"
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
        <el-form-item label="密码" prop="password">
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
          <DictSelect
            v-model="form.gender"
            :dictType="DictTypeEnum.GENDER"
            :type="DictShowType.RADIO"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role" v-if="formType === 'edit'">
          <DictSelect v-model="form.role" :dictType="DictTypeEnum.ROLE" placeholder="请选择角色" />
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
