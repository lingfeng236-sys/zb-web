<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { HomeFilled, User, ArrowDown } from '@element-plus/icons-vue' // 引入图标

defineOptions({
  name: 'LayoutIndex'
})
const router = useRouter()
const userStore = useUserStore()

// 处理下拉菜单点击
const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout()
  }
}

// 退出登录逻辑
const handleLogout = () => {
  userStore.logout() // 调用 store 里的 logout 清除 token
  // 这里的跳转在 store 里可能已经写了，或者在这里写 router.push('/login')
}
</script>

<template>
  <div class="layout-container">
    <el-container style="height: 100vh;">
      <el-aside width="200px" class="aside">
        <div class="logo">企业后台</div>
        <el-menu
          default-active="1"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页 Dashboard</span>
          </el-menu-item>

          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-left">
            <span>欢迎回来，Admin</span>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                个人中心<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>
.aside {
  background-color: #304156;
  color: #fff;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background-color: #2b2f3a;
}
.el-menu {
  border-right: none; /* 去掉菜单右侧默认的边框 */
}
.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
