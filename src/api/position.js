import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const position = {
  // 岗位列表
  positionList(param) {
    return axios.post(`${base.sq}/org/position/list`, param)
  },
  // 岗位新增
  positionAdd(param) {
    return axios.post(`${base.sq}/org/position`, param)
  },
  // 岗位更新
  positionUpt(param) {
    return axios.put(`${base.sq}/org/position`, param)
  },
  // 岗位详情,演示
  positionDetail(id, params) {
    return axios.get(`${base.sq}/org/position/detail/${id}`, {
      params: params
    })
  },
  positionDel(param) {
    return axios.delete(`${base.sq}/org/position`, { data: param })
  }
  // 其他接口…………
}

export default position
