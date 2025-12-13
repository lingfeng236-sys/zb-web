import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 1. 引入刚才安装的自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8079,
  },
  plugins: [
    VueDevTools(),
    vue(),
    // 2. 配置自动导入 API (比如 ref, reactive, computed, watch 等，以后不用写 import 了)
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],

      // === 新增下面这几行 ===
      eslintrc: {
        enabled: true, // 开启生成功能
        filepath: './.eslintrc-auto-import.json', // 生成的文件路径
        globalsPropValue: true,
      },
    }),
    // 3. 配置自动导入组件 (比如 ElButton, ElInput 等)
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
