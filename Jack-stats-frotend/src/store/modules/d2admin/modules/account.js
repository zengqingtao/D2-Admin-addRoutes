import util from '@/libs/util.js'
import { loginByUsername, getUserInfo, logout } from '@/api/login'
import { GetMenu } from '@/api/menu'
import { frameInRoutes } from '@/router/routes'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登陆
     * @param {Object} param context
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     */
    login ({ commit, dispatch }, { vm, username, password, url }) {
      // 开始请求登录接口
      loginByUsername(username, password, url)
        .then(res => {
          if (res.data.url != undefined && res.data.url.length > 0) {
            // 如果是带有url参数字段，则直接跳转到url页面
            window.location.href = res.data.url  
          } else {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('uuid', res.data.adminID)
            util.cookies.set('token', res.data.token)
            util.cookies.set('adminid', res.data.zhiyeAdminID)
            util.setToken(res.data.token)
            // 设置 vuex token信息
            commit('d2admin/user/SET_ACCESS_TOKEN', res.data.token, { root: true })
            commit('d2admin/user/SET_REFRESH_TOKEN', res.data.token, { root: true })
            // 用户登陆后从持久化数据加载一系列的设置
            commit('load')
            // 用户登陆后查询用户信息: 角色 数据权限
            dispatch('getUserInfo')
              .then(res => {
                GetMenu().then(res => {
                  console.log("登录用户信息：",res);
                  // 设置用户菜单
                  commit('d2admin/user/SET_MENU', res.data, { root: true })
                  let oRoutes = util.formatRoutes(res.data)
                  // 多页面控制: 处理路由 得到每一级的路由设置
                  commit('d2admin/page/init', [].concat(frameInRoutes, oRoutes), { root: true })
                  // 设置侧边栏菜单
                  commit('d2admin/menu/asideSet', res.data, { root: true })
                  // 设置顶栏菜单
                  commit('d2admin/menu/headerSet', res.data, { root: true })
                  vm.$router.addRoutes(oRoutes)
                  // 跳转路由
                  vm.$router.push({
                    name: 'index'
                  })
                })
              })
            }
          }
        ).catch(err => {
          console.group('登陆出错')
          console.log('err: ', err)
          console.groupEnd()
        })
    },
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          commit('d2admin/user/SET_USER_INFO', data.rolename + data.username, { root: true })
          commit('d2admin/user/SET_ROLES', data.role, { root: true })
          commit('d2admin/user/SET_ROLENAME', data.rolename, { root: true })
          commit('d2admin/user/SET_PERMISSIONS', data.permission, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * @description 注销用户并返回登陆页面
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout ({ commit }, { vm, confirm = false }) {
      /**
       * @description 注销
       */
      function doLogout () {
        logout(util.getToken()).then(() => {
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          util.removeToken()
          // 跳转路由
          vm.$router.push({
            name: 'login'
          })
        }).catch(error => {
          console.group('退出登录出错')
          console.log('err: ', error)
          console.groupEnd()
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        vm.$confirm('确定注销当前账户吗? ', '确认操作', {
          confirmButtonText: '确定注销',
          cancelButtonText: '放弃',
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            // 清空db中用户数据
            vm.$store.dispatch('d2admin/db/databaseClear', {
              dbName: 'sys',
              user: true
            })
            doLogout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            vm.$message('放弃注销用户')
          })
      } else {
        doLogout()
      }
    }
  },
  mutations: {
    /**
     * @description 用户登陆后从持久化数据加载一系列的配置
     * @param {Object} state vuex state
     */
    load (state) {
      // DB -> store 加载用户所有信息, 包括动态添加路由
      this.commit('d2admin/user/load')
      // DB -> store 加载主题
      this.commit('d2admin/theme/load')
      // DB -> store 加载页面过渡效果设置
      this.commit('d2admin/transition/load')
      // DB -> store 持久化数据加载上次退出时的多页列表
      this.commit('d2admin/page/openedLoad')
      // DB -> store 持久化数据加载这个用户之前设置的侧边栏折叠状态
      this.commit('d2admin/menu/asideCollapseLoad')
    }
  }
}
