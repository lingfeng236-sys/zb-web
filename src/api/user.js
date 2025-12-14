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

export function getUserPageApi(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params, // get 请求的参数要放在 params 里
  })
}

export function deleteUserApi(id) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete',
  })
}

export function addOrEditUserApi(data) {
  return request({
    url: '/user/addOrEdit',
    method: 'put',
    data,
  })
}

//  新增：获取用户详情
export function getUserDetailApi(id) {
  return request({
    url: `/user/get/${id}`,
    method: 'get',
  })
}
