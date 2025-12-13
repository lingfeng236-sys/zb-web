import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDictDataApi } from '@/api/dict'

export const useDictStore = defineStore('dict', () => {
  const dicts = ref({})

  // 获取字典数据的方法
  const getDict = async (dictType) => {
    // 1. 如果 Store 里已经有了，直接返回缓存，不发请求
    if (dicts.value[dictType]) {
      return dicts.value[dictType]
    }
    // 2. 如果没有，去后端请求
    try {
      const res = await getDictDataApi(dictType)
      const data = res
      // 3. 存入 Store
      dicts.value[dictType] = data
      return data
    } catch (error) {
      console.error('获取字典失败', error)
      return []
    }
  }

  return { dicts, getDict }
})
