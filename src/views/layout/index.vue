<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {
      activeMenu: '1',
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.activeMenu = index
    },
  },
}
</script>

<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="activeMenu" class="el-menu-vertical" @select="handleMenuSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span>菜单项 1</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span>菜单项 2</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span>菜单项 3</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            <h2>系统标题</h2>
            <div class="user-info">
              <span>用户名</span>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #545c64;
}

.el-menu {
  border-right: none;
}

.el-header {
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
