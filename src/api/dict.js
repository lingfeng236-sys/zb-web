import request from '@/utils/request'

// 获取字典数据
export function getDictDataApi(dictType) {
  return request({
    url: '/enum/obtainByDictType',
    method: 'get',
    params: { dictType },
  })

}
