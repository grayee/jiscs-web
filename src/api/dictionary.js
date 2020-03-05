import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const dictionary = {
  // 字典列表
  dictionaryList(param) {
    return axios.post(`${base.sq}/sys/dict/list`, param)
  },
  // 字典新增
  dictionaryAdd(param) {
    return axios.post(`${base.sq}/sys/dict`, param)
  },
  // 字典值新增
  dictValueAdd(type, param) {
    return axios.post(`${base.sq}/sys/dict/` + type, param)
  },
  // 字典更新
  dictionaryUpt(param) {
    return axios.put(`${base.sq}/sys/dict`, param)
  },
  // 字典值更新
  dictValueUpt(type, param) {
    return axios.put(`${base.sq}/sys/dict/` + type, param)
  },
  // 字典详情,演示
  dictionaryDetail(id, params) {
    return axios.get(`${base.sq}/sys/dict/detail/${id}`, {
      params: params
    })
  },
  dictionaryDel(param) {
    return axios.delete(`${base.sq}/sys/dict`, { data: param })
  },
  dictValueDel(param) {
    return axios.delete(`${base.sq}/sys/dict/` + param)
  },
  getValueTree(param) {
    return axios.get(`${base.sq}/sys/dict/tree/` + param)
  }
  // 其他接口…………
}

export default dictionary
