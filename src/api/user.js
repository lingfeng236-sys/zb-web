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

// 新增：获取当前用户信息
export function getUserInfoApi() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

// 新增：更新个人资料
export function updateProfileApi(data) {
  return request({
    url: '/user/updateProfile', // 记得后端 Controller 也要加这个接口哦，或者复用 addOrEdit 但要做限制
    method: 'put',
    data,
  })
}
