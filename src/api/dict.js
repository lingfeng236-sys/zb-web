import request from '@/utils/request'

// 获取字典数据
// 假设后端接口是 /system/dict/data/type/{dictType}
export function getDictDataApi(dictType) {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get',
  })
}
