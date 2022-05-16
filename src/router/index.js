import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'
// import EmptyLayout from '@/layout/EmptyLayout.vue'

/* Router Modules */
import contentRouter from './modules/content.js'

Vue.use(Router)

// ['admin', 'sder', 'platformer', 'reviewer']

// 没有角色权限控制的页面
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true,
    meta: { title: '登录' },
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'dashboard',
  //       meta: { title: '数据概况', icon: 'el-icon-pie-chart' },
  //     },
  //   ],
  // },
  // {
  //   path: '/switch-roles',
  //   component: Layout,
  //   redirect: '/switch-roles',
  //   children: [
  //     {
  //       path: 'switch-roles',
  //       component: () => import('@/views/switch-roles'),
  //       name: 'switch-roles',
  //       meta: { title: '角色切换', icon: 'el-icon-user' },
  //     },
  //   ],
  // },
]

// 需要根据用户角色动态加载的路由
export const asyncRoutes = [
  {
    path: '/',
    name: 'content',
    meta: { title: '内容管理', icon: 'el-icon-s-home', roles: ['admin', 'platformer', 'inputer'] },
    component: Layout,
    redirect: '/company',
    children: [
      {
        path: 'company',
        component: () => import('@/views/index/index'),
        name: 'company',
        meta: {
          title: '报单录入',
          roles: ['admin', 'platformer', 'inputer'],
        },
      },
    ],
  },
  {
    path: '/revenue',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/revenue'),
        name: 'revenue',
        meta: {
          title: '流水管理',
          icon: 'el-icon-coin',
          roles: ['admin', 'platformer', 'inputer'],
        },
      },
    ],
  },
  {
    path: '/launch',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/launch/index'),
        name: 'launch',
        meta: {
          title: '投放管理',
          icon: 'el-icon-data-analysis',
          roles: ['admin', 'platformer', 'launcher'],
        },
      },
    ],
  },
  {
    path: '/religious',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/religious'),
        name: 'religious',
        meta: {
          title: '法事管理',
          icon: 'el-icon-document',
          roles: ['admin', 'platformer', 'inputer'],
        },
      },
    ],
  },
  {
    path: '/service',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/service'),
        name: 'service',
        meta: {
          title: '售后管理',
          icon: 'el-icon-truck',
          roles: ['admin', 'platformer', 'inputer'],
        },
      },
    ],
  },
  contentRouter,

  // 404页面必须放在最后
  { path: '*', redirect: '/404', hidden: true },
]

// 解决官方bug
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new Router({
    mode: 'hash', // 需要服务端支持
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
