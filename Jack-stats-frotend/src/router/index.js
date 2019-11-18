import Vue from 'vue'
import VueRouter from 'vue-router'
import util from '@/libs/util.js'
import { validatenull } from '@/libs/validate.js'
import store from '@/store/index'
import { GetMenu } from '@/api/menu'
import { frameInRoutes } from '@/router/routes'

// 路由数据
import routes from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  console.log("1111111111111111111111");
  if (validatenull(store.state.d2admin.user.accessToken) && !validatenull(util.getToken())) {
    // 登录了还没有查询菜单
    // 查询用户菜单
    GetMenu().then(res => {
      console.log("res.data:",res.data);
      // 设置用户菜单
      store.commit('d2admin/user/SET_MENU', res.data)
      let oRoutes = util.formatRoutes(res.data)
      console.log("oRoutes:",oRoutes);
      // 多页面控制: 处理路由 得到每一级的路由设置
      store.commit('d2admin/page/init', [].concat(frameInRoutes, oRoutes))
      // 设置侧边栏菜单
      store.commit('d2admin/menu/asideSet', res.data)
      // 设置顶栏菜单
      store.commit('d2admin/menu/headerSet', res.data)
      router.addRoutes(oRoutes)
      if (util.checkRoute(res.data, to.path)) {
        next({ path: to.path })  
      } else {
        next({ name: 'index' })
      }
    }).catch(() => {
      // 查询菜单失败 跳转到登陆界面
      next({ name: 'login' })
    })
  } else {
    console.log("2222222222222222222222222222222222222");
    // 验证当前路由所有的匹配中是否需要有登陆验证的
    if (to.matched.some(r => r.meta.requiresAuth)) {
      const token = util.getToken()
      if (!validatenull(token)) {
        // token不为空,直接放行
        next()
      } else {
        console.log("444444444444444444444444444444");
        // 没有token 跳转到登陆界面
        next({
          name: 'login'
        })
      }
    } else {
      console.log("33333333333333333333333333333333333");
      // 不需要身份校验 直接通过
      next()
    }
  }
})

router.afterEach(to => {
  // 需要的信息
  const app = router.app
  const { name, params, query } = to
  // 多页控制 打开新的页面
  app.$store.commit('d2admin/page/open', { name, params, query })
  // 更改标题
  util.title(to.query.title ? to.query.title : to.meta.title)
})

export default router
