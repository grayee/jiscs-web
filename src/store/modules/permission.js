import {dynamicRoutes, constantRoutes } from '@/router'

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
      // console.log('菜单数据:：', JSON.stringify(menus))
      let asyncRoutes = getRouterByMenu(menus)
      asyncRoutes = asyncRoutes.concat(dynamicRoutes);
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
  let routers = []
  menus.forEach((menu) => {
    // 0:目录，1:功能菜单，2:按钮
    const menuType = menu.attributes.menuType;
    const router = {
      name: menu.path,
      path: menu.path,
      component: menuType === 0 ? () => import('@/layout') : () => import(`@/views/jiscs/${menu.attributes.component}`),
      hidden: menuType === 2,
      meta: {
        title: menu.text,
        icon: menu.iconCls
      }
    }
    if (menu.children && menu.children.length) {
      const fistChildren = menu.children[0]
      if (fistChildren.attributes.menuType !== 2) {
        router.redirect = router.path + '/' + fistChildren.path
        router.children = getRouterByMenu(menu.children)
      } else {
        routers = routers.concat(getRouterByMenu(menu.children))
      }
    } else {
      router.children = []
    }
    routers.push(router)
  })
  return routers
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
