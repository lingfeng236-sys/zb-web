import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import fs from 'node:fs' // 1. 新增：引入文件读取模块

// 2. 新增：尝试读取自动生成的文件
let autoImportGlobals = {}
try {
  const data = fs.readFileSync('./.eslintrc-auto-import.json', 'utf-8')
  autoImportGlobals = JSON.parse(data).globals
} catch (e) {
  // 如果文件还没生成（比如刚拉取项目），先忽略，运行 npm run dev 后就有了
  console.warn('Auto-import config not found, please run dev server.', e)
}

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // 3. 新增：将自动引入的变量注入到全局配置中
  {
    languageOptions: {
      globals: {
        ...autoImportGlobals,
      },
    },
  },
  skipFormatting,
]
