<script setup>
defineOptions({
  name: 'DashboardIndex'
})
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>访问量</template>
          <h2 class="card-num">23,190</h2>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>销售额</template>
          <h2 class="card-num">¥ 120,000</h2>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>订单数</template>
          <h2 class="card-num">3,400</h2>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>新增用户</template>
          <h2 class="card-num">102</h2>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-top: 20px; height: 400px;">
      <template #header>数据趋势图 (占位)</template>
      <div style="text-align: center; color: #999; margin-top: 100px;">
        ECharts 图表区域
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-num {
  margin: 0;
  font-size: 24px;
  color: #409EFF;
}
</style>
