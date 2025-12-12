<template>
  <RouterView />
</template>

<script setup>
// App.vue 是根组件，通常只需要放一个 RouterView 即可
// 具体的页面布局会在 RouterView 里渲染
</script>

<style>
/* 全局样式，确保高度撑满 */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
