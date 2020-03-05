import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const employee = {
  // 员工列表
  employeeList(param) {
    return axios.post(`${base.sq}/org/employee/list`, param)
  },
  // 员工新增
  employeeAdd(param) {
    return axios.post(`${base.sq}/org/employee`, param)
  },
  // 员工更新
  employeeUpt(param) {
    return axios.put(`${base.sq}/org/employee`, param)
  },
  // 员工详情,演示
  employeeDetail(id, params) {
    return axios.get(`${base.sq}/org/employee/detail/${id}`, {
      params: params
    })
  },
  employeeDel(param) {
    return axios.delete(`${base.sq}/org/employee`, { data: param })
  }
  // 其他接口…………
}

export default employee
