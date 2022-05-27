import { constantRoutes, asyncRoutes } from '@/router'

// 使用 meta.roles 判断当前用户是否有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  }
  return true
}

// 通过递归过滤异步路由表
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
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

        // 权限判断后，页面登录后路由跳转到第一个路由
        accessedRoutes.some(route => {
          if (route.children[0] && route.children[0].path) {
            if (roles[0] !== 'launcher') {
              route.redirect = '/company'
            } else {
              route.redirect = `/launch/deal`
            }
            return true
          }
          return false
        })
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
