import { constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, menus }) {
    return new Promise(resolve => {
      console.log('菜单数据:：', JSON.stringify(menus))
      const asyncRoutes = getRouterByMenu(menus)
      console.log('路由数据:：', JSON.stringify(asyncRoutes))
      let accessedRoutes
      if (roles.includes('ROLE_ADMIN')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function getRouterByMenu(menus) {
  const routers = []
  menus.forEach((menu) => {
    const curRouter = {
      name: menu.path,
      path: menu.path,
      component: menu.attributes.component === '' ? () => import('@/layout') : () => import('@/views/jiscs/company'),
      meta: {
        title: menu.text
      }
    }
    let children = []
    if (menu.attributes.pageBtn) {
      children = getRouterByMenu(menu.attributes.pageBtn).concat(children)
      children.forEach(menu => {
        menu.hidden = true
        return menu
      })
    }
    if (menu.children && menu.children.length) {
      const fistChildren = menu.children[0]
      curRouter.path = '/' + fistChildren.path.split('/')[1]
      curRouter.redirect = fistChildren.path
      curRouter.children = getRouterByMenu(menu.children).concat(children)
    } else {
      curRouter.children = children
    }
    routers.push(curRouter)
  })
  return routers
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
