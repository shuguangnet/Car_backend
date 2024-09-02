import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },
  // 停车场
  {
    path: '/parking',
    component: Layout,
    redirect: '/parking/parkingList',
    name: 'Parking',
    meta: { title: '停车场', icon: 'parking' },

    children: [
      {
        path: 'parkingList',
        name: 'ParkingList',
        component: () => import('@/views/parking/parkingList'),
        meta: { title: '列表管理' }
      },
      {
        path: 'addParking',
        name: 'AddParking',
        component: () => import('@/views/parking/addParking'),
        meta: { title: '新增停车场'}
      }
    ]
  },
  // 车辆品牌
  {
    path: '/carBrand',
    component: Layout,
    redirect: '/carBrand/brandList',
    name: 'CarBrand',
    meta: { title: '车辆品牌', icon: 'pinpaizhuanqu' },
    alwaysShow: true,
    children: [
      {
        path: 'brandList',
        name: 'BrandList',
        component: () => import('@/views/carBrand/brandList'),
        meta: { title: '品牌列表' }
      }
    ]
  },
  // 车辆管理
  {
    path: '/carManage',
    component: Layout,
    redirect: '/carManage/carList',
    name: 'CarManage',
    meta: { title: '车辆管理', icon: 'cheliangguanli' },
    alwaysShow: true,
    children: [
      {
        path: 'carList',
        name: 'CarList',
        component: () => import('@/views/carManage/carList'),
        meta: { title: '车辆列表' }
      },
      {
        path: 'carAttr',
        name: 'CarAttr',
        component: () => import('@/views/carManage/carAttr'),
        meta: { title: '车辆属性' }
      },
      {
        path: 'addCar',
        name: 'AddCar',
        component: () => import('@/views/carManage/addCar'),
        meta: { title: '新增车辆' }
      }
    ]
  },
  // 会员管理
  {
    path: '/memberManage',
    component: Layout,
    redirect: '/memberManage/memberList',
    name: 'MemberManage',
    meta: { title: '会员管理', icon: 'member' },
    alwaysShow: true,
    children: [
      {
        path: 'memberList',
        name: 'MemberList',
        component: () => import('@/views/memberManage/memberList'),
        meta: { title: '会员列表' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
