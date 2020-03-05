import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const accounting = {
  // 科目列表
  subjectList(param) {
    return axios.post(`${base.sq}/baseSetting/accountSubject/list`, param)
  },
  // 科目新增
  subjectAdd(param) {
    return axios.post(`${base.sq}/org/company`, param)
  },
  // 科目更新
  subjectUpt(param) {
    return axios.put(`${base.sq}/baseSetting/accountSubject`, param)
  },
  // 科目详情
  subjectDetail(id, params) {
    return axios.get(`${base.sq}/baseSetting/accountSubject/detail/${id}`, {
      params: params
    })
  },
  subjectDel(param) {
    return axios.delete(`${base.sq}/baseSetting/accountSubject`, { data: param })
  }
  // 其他接口…………
}

export default accounting
