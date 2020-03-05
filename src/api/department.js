import request from '@/utils/request'

// 公司列表
export function departmentList(param) {
  return request({
    url: '/org/department/list',
    method: 'post',
    param
  })
}

// 部门新增
export function departmentAdd(param) {
  return request({
    url: '/org/department',
    method: 'post',
    param
  })
}

// 部门新增
export function departmentUpt(param) {
  return request({
    url: '/org/department',
    method: 'put',
    param
  })
}

// 部门详情,演示
export function departmentDetail(id, param) {
  return request({
    url: 'org/department/detail/${id}',
    method: 'get',
    params: { param }
  })
}

export function departmentDel(param) {
  return request({
    url: '/org/department',
    method: 'delete',
    params: { param }
  })
}
