import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

import { validatenull } from '@/libs/validate.js'//-------------------引入
import { GetMenu } from '@/api/menu' //-------------------------引入
import { frameInRoutes } from '@/router/routes'
Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
//--------------↓修改

router.beforeEach((to, from, next) => {
  if (validatenull(store.state.d2admin.user.accessToken) && !validatenull(util.getToken())) {
    // 登录了还没有查询菜单
    // 查询用户菜单
    GetMenu().then(res => {
      // 设置用户菜单
      store.commit('d2admin/user/SET_MENU', res)
      let oRoutes = util.formatRoutes(res)
      // 多页面控制: 处理路由 得到每一级的路由设置
      store.commit('d2admin/page/init', [].concat(frameInRoutes, oRoutes))
      // 设置侧边栏菜单
      store.commit('d2admin/menu/asideSet', res)
      // 设置顶栏菜单
      store.commit('d2admin/menu/headerSet', [])
      router.addRoutes(oRoutes)
      if (util.checkRoute(res, to.path)) {
        next()
      } else {
        next({ name: 'index' })
      }
      
    }).catch(() => {
      // 查询菜单失败 跳转到登陆界面
      next()
    })
  } else {
    // 验证当前路由所有的匹配中是否需要有登陆验证的
    if (to.matched.some(r => r.meta.requiresAuth)) {
      const token = util.getToken()
      if (!validatenull(token)) {
        // token不为空,直接放行
        next()
      } else {
        // 没有token 跳转到登陆界面
        next({
          name: 'login'
        })
      }
    } else {
      // 不需要身份校验 直接通过
      next()
    }
  }
})
//----------------↑修改

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
