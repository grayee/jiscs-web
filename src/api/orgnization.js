import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const org = {

  /**
   * 获取机构关系树
   * @param param 机构类型
   */
  getRelationTree(param) {
    return axios.get(`${base.sq}/org/relation/tree/` + param)
  },

  /**
   * 获取指定类型的树
   * @param param 机构类型
   */
  getTargetTree(param) {
    return axios.get(`${base.sq}/org/relation/tree/target/` + param)
  },

  /**
   * 机构明细
   * @param param ID
   */
  getOrgDetail(param) {
    return axios.get(`${base.sq}/org/relation/detail/` + param)
  }
  // 其他接口…………
}

export default org
