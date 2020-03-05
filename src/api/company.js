import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const company = {
  // 公司列表
  companyList(param) {
    return axios.post(`${base.sq}/org/company/list`, param)
  },
  // 公司新增
  companyAdd(param) {
    return axios.post(`${base.sq}/org/company`, param)
  },
  // 公司更新
  companyUpt(param) {
    return axios.put(`${base.sq}/org/company`, param)
  },
  // 公司详情,演示
  companyDetail(id, params) {
    return axios.get(`${base.sq}/org/company/detail/${id}`, {
      params: params
    })
  },
  companyDel(param) {
    return axios.delete(`${base.sq}/org/company`, { data: param })
  }
  // 其他接口…………
}

export default company
