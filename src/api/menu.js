import request from '@/utils/request'

/**
 * 获取菜单树
 * @param param 用户名
 */
export function getMenuTree(param) {
  return request({
    url: '/auth/menu/tree',
    method: 'get',
    params: { param }
  })
}

/**
 * 菜单新增
 * @param param 菜单实体
 * @returns {*}
 */
export function menuAdd(param) {
  return request({
    url: '/auth/menu',
    method: 'post',
    param
  })
}

/**
 * 菜单详情
 * @param param 菜单ID
 * @returns {*}
 */
export function menuDetail(param) {
  return request({
    url: '/auth/menu/detail',
    method: 'get',
    params: { param }
  })
}

/**
 * 菜单删除,https://blog.csdn.net/qq383366204/article/details/80268007
 * @param param 菜单ID数组
 * @returns {*}
 */
export function menuDel(param) {
  return request({
    url: '/auth/menu',
    method: 'delete',
    params: { param }
  })
}

/**
 * 菜单更新
 * @param param 菜单ID数组
 * @returns {*}
 */
export function menuUpt(param) {
  return request({
    url: '/auth/menu',
    method: 'put',
    params: { param }
  })
}

/**
 * 获取资源树
 * @param param 用户名
 */
export function getResourceTree(param) {
  return request({
    url: '/auth/resource/tree',
    method: 'get',
    params: { param }
  })
}

/**
 * 资源新增权限
 * @param id 资源id
 * @param param 权限
 */
export function resourceAddPermission(id, param) {
  return request({
    url: '/auth/resource/permission/' + id,
    method: 'post',
    params: param
  })
}

/**
 * 资源删除权限
 * @param id 资源id
 * @param param 权限
 */
export function permissionDel(param) {
  return request({
    url: '/auth/resource/permission',
    method: 'delete',
    params: { param }
  })
}

/**
 * 更新权限
 * @param param 权限信息
 * @returns {IDBRequest | Promise<void>}
 */
export function permissionUpt(id, param) {
  return request({
    url: '/auth/resource/permission' + id,
    method: 'put',
    params: { param }
  })
}
