<template>
  <div style="text-align: center; margin-top: 100px">
    <h1>环境配置测试</h1>

    <el-button type="primary" size="large"> 如果你看到我是蓝色的，就成功了！ </el-button>

    <div style="margin-top: 20px">
      <el-tag type="success">Tag 组件也自动引入了</el-tag>
    </div>
  </div>
</template>

<script setup>
// 这里我们甚至不需要 import { ref } from 'vue'，因为 AutoImport 插件帮我们做了
const testVar = ref('Vue API 自动引入也生效了')
console.log(testVar.value)
</script>
