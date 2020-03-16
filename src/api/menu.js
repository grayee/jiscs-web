import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const menu = {
  /**
   * 获取菜单树
   * @param param 用户名
   */
  getMenuTree(param) {
    return axios.get(`${base.sq}/auth/menu/tree`)
  },
  /**
   * 菜单新增
   * @param param 菜单实体
   * @returns {*}
   */
  getMenuList(param) {
    return axios.post(`${base.sq}/auth/menu/list`, param)
  },
  /**
   * 菜单新增
   * @param param 菜单实体
   * @returns {*}
   */
  menuAdd(param) {
    return axios.post(`${base.sq}/auth/menu`, param)
  },
  /**
   * 菜单详情
   * @param param 菜单ID
   * @returns {*}
   */
  menuDetail(param) {
    return axios.get(`${base.sq}/auth/menu/detail/` + param)
  },
  /**
   * 菜单删除,https://blog.csdn.net/qq383366204/article/details/80268007
   * @param param 菜单ID数组
   * @returns {*}
   */
  menuDel(param) {
    return axios.delete(`${base.sq}/auth/menu`, { data: param })
  },
  /**
   * 菜单更新
   * @param param 菜单ID数组
   * @returns {*}
   */
  menuUpt(param) {
    return axios.put(`${base.sq}/auth/menu`, param)
  },
  /**
   * 获取资源树
   * @param param 用户名
   */
  getResourceTree(param) {
    return axios.get(`${base.sq}/auth/resource/tree`)
  },
  /**
   * 资源新增权限
   * @param id 资源id
   * @param param 权限
   */
  resourceAddPermission(id, param) {
    return axios.post(`${base.sq}/auth/resource/permission/` + id, param)
  },
  /**
   * 资源删除权限
   * @param id 资源id
   * @param param 权限
   */
  permissionDel(param) {
    return axios.delete(`${base.sq}/auth/resource/permission`, { data: param })
  },
  /**
   * 更新权限
   * @param param 权限信息
   * @returns {IDBRequest | Promise<void>}
   */
  permissionUpt(id, param) {
    return axios.put(`${base.sq}/auth/resource/permission/` + id, param)
  }
  // 其他接口…………
}

export default menu
