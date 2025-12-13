import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

// === 新增：注册接口 ===
export function registerApi(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}
