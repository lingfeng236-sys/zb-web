<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  User,
  ArrowDown,
  Expand,
  Fold,
  SwitchButton,
  Operation,
} from '@element-plus/icons-vue'

defineOptions({
  name: 'LayoutIndex',
})

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const isCollapse = ref(false)

// 获取当前激活的菜单项 (根据当前路由路径)
const activeMenu = computed(() => route.path)

// 动态获取菜单路由
const menuRoutes = computed(() => {
  const layoutRoute = router.options.routes.find((r) => r.path === '/')
  if (!layoutRoute || !layoutRoute.children) return []

  // 过滤掉隐藏的路由和个人中心
  return layoutRoute.children.filter(
    (item) => !item.hidden && item.meta?.title && item.path !== 'profile',
  )
})

// 图标映射
const iconMap = {
  dashboard: HomeFilled,
  user: User,
  workflow: Operation,
}

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile') // 跳转到个人中心
  } else if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <img
          v-if="!isCollapse"
          src="https://element-plus.org/images/element-plus-logo.svg"
          alt="logo"
          class="logo-img"
        />
        <span v-else>E+</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        :collapse-transition="false"
      >
        <!-- 动态渲染菜单 -->
        <template v-for="item in menuRoutes" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item
            v-if="!item.children || item.children.length === 0"
            :index="'/' + item.path"
          >
            <el-icon>
              <component :is="iconMap[item.path] || HomeFilled" />
            </el-icon>
            <template #title>{{ item.meta.title }}</template>
          </el-menu-item>

          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="'/' + item.path">
            <template #title>
              <el-icon>
                <component :is="iconMap[item.path] || HomeFilled" />
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children.filter((c) => !c.hidden)"
              :key="child.path"
              :index="'/' + item.path + '/' + child.path"
            >
              {{ child.meta.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="trigger-icon" @click="toggleSidebar">
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '首页' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar
                :size="30"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="username">{{ userStore.userInfo.username }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">个人中心</el-dropdown-item>
                <el-dropdown-item divided command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}
.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}
.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b2f3a;
  color: #fff;
  font-weight: bold;
}
.logo-img {
  height: 28px;
}
.el-menu-vertical {
  border-right: none;
}
.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.trigger-icon {
  font-size: 20px;
  cursor: pointer;
}
.header-right .el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.username {
  margin: 0 8px;
  font-weight: 500;
}
.main {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
