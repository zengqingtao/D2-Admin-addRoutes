import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { loginByUsername,getUserInfo} from '@api/sys.login' //-----------添加
import { GetMenu } from '@/api/menu' //-----------添加
import { frameInRoutes } from '@/router/routes' //-----------添加

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch,commit },{ vm, username, password}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        loginByUsername({
          username,
          password
        })
          .then(async res => {
            console.log("login-res:",res);
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('uuid', res.uuid)
            util.cookies.set('token', res.token)
            util.setToken(res.token)
            //-----------------------------------------------------------↓添加并修改
            // 设置 vuex token信息
            commit('d2admin/user/SET_ACCESS_TOKEN', res.token, { root: true })
            commit('d2admin/user/SET_REFRESH_TOKEN', res.token, { root: true })
            //-----------------------------------------------------------↑添加
            // 设置 vuex 用户信息
            // -----------------------↓添加
            // 用户登陆后查询用户信息: 角色 数据权限
            dispatch('getUserInfo').then(res => {
                GetMenu().then(res => {
                  // 设置用户菜单
                  commit('d2admin/user/SET_MENU', res, { root: true })
                  let oRoutes = util.formatRoutes(res)
                  // 多页面控制: 处理路由 得到每一级的路由设置
                  commit('d2admin/page/init', [].concat(frameInRoutes, oRoutes), { root: true })
                  // 设置侧边栏菜单
                  commit('d2admin/menu/asideSet', res, { root: true })
                  // 设置顶栏菜单
                  commit('d2admin/menu/headerSet', res, { root: true })
                  router.addRoutes(oRoutes)
                  // 跳转路由
                  router.push({
                    name: 'index'
                  })
                })
              })
            // -----------↑添加
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    //------------------------------------↓下添加并修改
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          // console.log("response:",response);
          const data = response
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
    //-----------------------------------↑下添加并修改
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('注销当前账户吗?  打开的标签页和用户设置将会被保存。', '确认操作', {
          confirmButtonText: '确定注销',
          cancelButtonText: '放弃',
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '放弃注销用户'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
