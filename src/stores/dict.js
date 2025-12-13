import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { getDictDataApi } from '@/api/dict'

export const useDictStore = defineStore('dict', () => {
  // 存储字典数据，格式: { 'gender': [...], 'packaging_version': [...] }
  const dicts = ref({})

  // 获取字典数据的方法
  const getDict = async (dictType) => {
    // 1. 如果 Store 里已经有了，直接返回缓存，不发请求
    if (dicts.value[dictType]) {
      return dicts.value[dictType]
    }

    // 2. 如果没有，去后端请求
    try {
      // === 真实对接后端代码 (暂时注释) ===
      // const res = await getDictDataApi(dictType)
      // const data = res.data

      // === 模拟后端返回的数据 (根据你的截图 mock 数据) ===
      console.log(`正在从后端获取字典: ${dictType}`)
      const mockData = mockBackendData(dictType)

      // 3. 存入 Store
      dicts.value[dictType] = mockData
      return mockData
    } catch (error) {
      console.error('获取字典失败', error)
      return []
    }
  }

  return { dicts, getDict }
})

// 模拟后端数据辅助函数
function mockBackendData(type) {
  if (type === 'packaging_version') {
    return [
      // 这里改为 code 和 desc
      { desc: 'GEO', code: 1 },
      { desc: 'LUX', code: 2 },
      { desc: 'STDX', code: 3 },
      { desc: 'PMTA', code: 4 },
      // ...
    ]
  }
  if (type === 'gender') {
    return [
      // 注意：截图里 getCode 返回 Integer，所以这里建议用数字
      { desc: '男', code: 1 },
      { desc: '女', code: 2 },
    ]
  }
  return []
}
