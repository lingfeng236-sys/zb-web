<script setup>
// import { defineOptions, reactive } from 'vue'
// 引入我们刚才封装的组件 (由于配置了自动引入组件，其实不需要手动 import，但为了明确演示我写在这里)
// import DictSelect from '@/components/DictSelect/index.vue'

defineOptions({
  name: 'DashboardIndex',
})

// 表单数据
const queryParams = reactive({
  packVersion: '', // 包装版本
  gender: '', // 性别
})

// 监听变更
const handleVersionChange = (val) => {
  console.log('选中的包装版本是:', val)
}
</script>

<template>
  <div class="app-container" style="padding: 20px">
    <el-card header="字典组件测试">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="包装版本">
          <DictSelect
            v-model="queryParams.packVersion"
            dict-code="packaging_version"
            placeholder="All"
            @change="handleVersionChange"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="用户性别">
          <DictSelect
            v-model="queryParams.gender"
            dict-code="gender"
            type="radio"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 20px; background: #f4f4f5; padding: 10px">
        <p>当前选中的值：</p>
        <p>包装版本: {{ queryParams.packVersion }}</p>
        <p>性别: {{ queryParams.gender }}</p>
      </div>
    </el-card>
  </div>
</template>
