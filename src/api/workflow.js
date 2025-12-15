import request from '@/utils/request'

// 1. 获取我的待办任务
// 后端路径: GET /workflow/tasks/todo
export function getMyTodoTasks(params) {
  return request({
    url: '/workflow/tasks/todo',
    method: 'get',
    params, // { pageNum, pageSize }
  })
}

// 2. 获取任务详情（聚合接口，包含任务信息和业务数据）
// 后端路径: GET /workflow/task/detail/{taskId}
export function getTaskDetail(taskId) {
  return request({
    url: `/workflow/task/detail/${taskId}`,
    method: 'get',
  })
}

// 3. 完成/审批任务
// 后端路径: POST /workflow/task/complete/{taskId}
export function completeTask(taskId, data) {
  return request({
    url: `/workflow/task/complete/${taskId}`,
    method: 'post',
    data, // { approved: true, comment: '...' }
  })
}

// 4. 签收任务
// 后端路径: POST /workflow/task/claim/{taskId}
export function claimTask(taskId) {
  return request({
    url: `/workflow/task/claim/${taskId}`,
    method: 'post',
  })
}

// 5. 发起请假流程 (对应后端 CamundaTestController)
// 后端路径: POST /camunda/test/startLeave
export function startLeaveProcess(data) {
  return request({
    url: '/camunda/test/startLeave',
    method: 'post',
    // 注意：后端是用 @RequestParam 接收的，所以这里要转成 params 或者 form data
    // 如果后端改成了 @RequestBody，这里就直接传 data
    params: {
      name: data.name,
      day: data.day,
    },
  })
}
